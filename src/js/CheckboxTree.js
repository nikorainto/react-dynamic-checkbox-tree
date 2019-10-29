import React from 'react'
import CheckboxNode from './CheckboxNode'

class CheckboxTree extends React.Component {
  state = {
    expanded: [],
  }

  // Prevent unecessary renders
  shouldComponentUpdate(nextProps, nextState) {
    // Check if values have changed
    const checkedChanged =
      nextProps.checked.length !== this.props.checked.length
    const expandedChanged =
      nextState.expanded.length !== this.state.expanded.length
    return checkedChanged || expandedChanged
  }

  formatNodes(nodes) {
    // Flatten all the nested arrays to a single array
    // Add paths to each element so the depth and parents can be traced
    const { expanded } = this.state
    const { checked } = this.props
    const formattedArray = []
    const formatOperation = (nodes, parentsPath = null) => {
      for (const node of nodes) {
        if (node.id && node.label) {
          const fullPath = parentsPath
            ? `${parentsPath}/${node.id}`
            : `/${node.id}`

          formattedArray.push({
            id: node.id,
            label: node.label,
            depth: fullPath.split('/').length - 2,
            checked: checked.includes(node.id),
            expanded: expanded.includes(node.id),
            path: fullPath,
            children: node.children,
          })

          // If the node has children and is expanded, run this function again aganist the children until no more childrens occure
          if (node.children && expanded.includes(node.id)) {
            formatOperation(node.children, fullPath)
          }
        } else {
          console.error(
            `Node: ${node} is missing required attributes (id & label)`
          )
        }
      }
    }

    formatOperation(nodes)
    return formattedArray
  }

  generateCheckboxTree(nodes) {
    // Generate the elements from the data
    return (
      <React.Fragment>
        {nodes.map(node => (
          <CheckboxNode
            {...this.props}
            key={node.id}
            label={node.label}
            depth={node.depth}
            checked={node.checked}
            expanded={node.expanded}
            onCheck={() => this.toggleNodeCheck(node)}
            onExpand={() => this.toggleExpandCheck(node)}
            hasChildren={!!node.children}
            indeterminate={() => this.checkIndeterminate(node)}
          />
        ))}
      </React.Fragment>
    )
  }

  toggleNodeCheck(node) {
    // Run this when node is checked/unchecked
    let checked = [...this.props.checked]

    const isChecked = !checked.includes(node.id)

    isChecked
      ? !checked.includes(node.id) && checked.push(node.id)
      : (checked = checked.filter(elem => elem !== node.id))

    // Check if parent node was checked and need to check all children (and childrens children)
    if (node.children) {
      const CheckOrUncheckAllChildren = nodes => {
        for (const node of nodes) {
          isChecked
            ? !checked.includes(node.id) && checked.push(node.id)
            : (checked = checked.filter(elem => elem !== node.id))
          if (node.children) {
            CheckOrUncheckAllChildren(node.children)
          }
        }
      }
      CheckOrUncheckAllChildren(node.children)
    }

    // This is run when a node is checked
    // If all of the children are checked, also check parent(s)
    if (isChecked) {
      const { path } = node
      const parents = path
        .split('/')
        .slice(1, -1)
        .reverse()
      const { nodes } = this.props
      // This line below is not performant at all and should be fixed !!!
      const formattedNodes = this.formatNodes(nodes)
      for (const parent of parents) {
        let parentsChildren = formattedNodes.filter(node =>
          node.path.includes(parent)
        )

        // Remove first element because its the parent
        parentsChildren.shift()

        const parentsAllChildrenChecked = parentsChildren.every(child =>
          checked.includes(child.id)
        )
        const numParent = Number(parent)
        if (parentsAllChildrenChecked && !checked.includes(numParent)) {
          !checked.includes(numParent) && checked.push(numParent)
        }
      }
    }

    // This is run when a node is unchecked
    // If one children is unchecked, also uncheck all parents
    if (!isChecked) {
      const { path } = node
      const parents = path.split('/').slice(1, -1)
      for (const parent of parents) {
        checked = checked.filter(elem => elem !== Number(parent))
      }
    }

    this.props.onCheck(checked)
  }

  toggleExpandCheck(node) {
    // Run this when node is expanded/disbanded
    let expanded = [...this.state.expanded]

    const idFromPath = Number(node.path.split('/').pop())

    const isExpanded = expanded.includes(idFromPath)

    isExpanded
      ? (expanded = expanded.filter(elem => elem !== idFromPath))
      : expanded.push(idFromPath)

    // Also remove expand from all children
    // Check if parent node was checked and need to check all children (and childrens children)
    if (node.children) {
      const removeExpandFromAllChildren = nodes => {
        for (const node of nodes) {
          expanded = expanded.filter(elem => elem !== node.id)

          if (node.children) {
            removeExpandFromAllChildren(node.children)
          }
        }
      }
      removeExpandFromAllChildren(node.children)
    }

    this.setState({ expanded })
  }

  checkIndeterminate(node) {
    if (node.children) {
      const allChildren = []

      const listNodesChildren = nodes => {
        for (const node of nodes) {
          allChildren.push(node.id)

          if (node.children) {
            listNodesChildren(node.children)
          }
        }
      }

      listNodesChildren(node.children)

      const { checked } = this.props

      let checker = (arr, target) => target.every(v => arr.includes(v))

      const allChildrenChecked = checker(checked, allChildren)

      const someChildrenChecked = checked.some(node =>
        allChildren.includes(node)
      )

      return allChildrenChecked ? false : someChildrenChecked
    }
  }

  render() {
    const { nodes } = this.props
    const formattedNodes = this.formatNodes(nodes)
    return (
      <React.Fragment>
        {this.generateCheckboxTree(formattedNodes)}
      </React.Fragment>
    )
  }
}

export default CheckboxTree
