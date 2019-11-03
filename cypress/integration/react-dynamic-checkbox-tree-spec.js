/* eslint-disable no-undef */
// @ts-nocheck
describe('react-dynamic-checkbox-tree', () => {
  it('can find all checkboxes, labels and icons', () => {
    cy.visit('http://localhost:8888/')

    cy.contains('react-dynamic-checkbox-tree')
    cy.fixture('data').then(nodes => {
      const nodesWithChildren = nodes
        .map(node => (node.children ? 1 : 0))
        .reduce((a, b) => a + b, 0)
      cy.get('input').should('have.length', nodes.length)
      cy.get('label').should('have.length', nodes.length)
      cy.get('svg').should('have.length', nodesWithChildren)
    })
  })

  it('can check the four root checkboxes', () => {
    cy.fixture('data').then(nodes => {
      nodes.forEach(node => {
        cy.get(`#${node.id}`).check()
      })
    })

    cy.get('input').should('be.checked')
  })

  it('can extend the nodes', () => {
    cy.fixture('data').then(nodes => {
      const extendNodes = nodes => {
        nodes.forEach(node => {
          cy.get(`#${node.id}`)
            .siblings('span')
            .click()

          if (node.children) {
            extendNodes(node.children)
          }
        })
      }
      extendNodes(nodes)
    })
  })

  it('all checkboxes should be visible and checked', () => {
    cy.fixture('data').then(nodes => {
      let length = 0
      const getLengthOfAllNodes = nodes => {
        nodes.forEach(node => {
          length++
          if (node.children) {
            getLengthOfAllNodes(node.children)
          }
        })
      }
      getLengthOfAllNodes(nodes)
      nodes.forEach(node => {
        cy.get(`#${node.id}`).should('be.checked')
      })
      cy.get(`input`).should('have.length', length)
    })
  })

  it('checkbox indeterminate works', () => {
    cy.fixture('data').then(nodes => {
      cy.get(`#${nodes[0].children[0].id}`).uncheck()
      cy.get(`#${nodes[0].id}`).should('not.be.checked')
    })
  })

  it('can collapse the nodes', () => {
    cy.fixture('data').then(nodes => {
      nodes.forEach(node => {
        cy.get(`#${node.id}`)
          .siblings('span')
          .click()
      })
      cy.get('input').should('have.length', nodes.length)
    })
  })
})
