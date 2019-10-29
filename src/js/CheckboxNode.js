import React from 'react'

const ArrowIcon = rotation => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="16 16 32 32"
    aria-labelledby="title"
    aria-describedby="desc"
    role="img"
    style={{ width: 14, height: 14, transform: `rotate(${rotation || 0}deg)` }}
  >
    <path
      data-name="layer1"
      fill="none"
      stroke={'#000'}
      strokeMiterlimit="10"
      strokeWidth="4"
      d="M26 20.006L40 32 26 44.006"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
)

const CheckboxTree = ({
  label,
  depth,
  checked,
  expanded,
  onCheck,
  onExpand,
  hasChildren,
  indeterminate,
  classNameNodeContainer = null,
  classNameLabel = null,
  classNameParentLabel = null,
  classNameCheckbox = null,
  classNameCheckboxIcon = null,
  styleNodeContainer = null,
  styleLabel = null,
  styleParentLabel = null,
  styleCheckbox = null,
  styleCheckboxIcon = null,
}) => {
  const styles = {
    CheckboxNodeContainer: {
      margin: 10,
      fontSize: 18,
      display: 'flex',
      marginLeft: depth * 18,
    },
    ExpandIcon: {
      cursor: 'pointer',
    },
    DefaultMarginLeft: {
      marginLeft: 14,
    },
    CheckboxNode: {
      width: 16,
      height: 16,
    },
    Label: {
      fontStyle: 'none',
    },
    ParentLabel: {
      fontStyle: 'none',
    },
  }
  return (
    <div
      style={styleNodeContainer || styles.CheckboxNodeContainer}
      className={classNameNodeContainer}
    >
      <span>
        {hasChildren ? (
          <React.Fragment>
            {expanded ? (
              <span
                style={styleCheckboxIcon || styles.ExpandIcon}
                className={classNameCheckboxIcon}
                onClick={() => onExpand()}
              >
                {ArrowIcon(90)}
              </span>
            ) : (
              <span
                style={styleCheckboxIcon || styles.ExpandIcon}
                className={classNameCheckboxIcon}
                onClick={() => onExpand()}
              >
                {ArrowIcon(0)}
              </span>
            )}
          </React.Fragment>
        ) : (
          <div style={styles.DefaultMarginLeft} />
        )}
      </span>
      <input
        type="checkbox"
        className={classNameCheckbox}
        checked={checked}
        style={styleCheckbox || styles.CheckboxNode}
        onChange={() => onCheck()}
        ref={el => el && (el.indeterminate = indeterminate())}
      />
      <label
        style={
          hasChildren
            ? styleParentLabel || styles.ParentLabel
            : styleLabel || styles.Label
        }
        className={hasChildren ? classNameParentLabel : classNameLabel}
      >
        {label}
      </label>
    </div>
  )
}

export default CheckboxTree
