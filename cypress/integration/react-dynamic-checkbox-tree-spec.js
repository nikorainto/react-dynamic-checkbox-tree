/* eslint-disable no-undef */
// @ts-nocheck
describe('react-dynamic-checkbox-tree', function() {
  it('can find all checkboxes, labels and icons', function() {
    cy.visit('http://localhost:8888/')

    cy.contains('react-dynamic-checkbox-tree')
    cy.get('input').should('have.length', 4)
    cy.get('label').should('have.length', 4)
    cy.get('svg').should('have.length', 3)
  })

  it('can check the four checkboxes', function() {
    cy.fixture('data').then(nodes => {
      nodes.forEach(node => {
        cy.get(`#${node.id}`).check()
      })
    })
  })
})
