import faker from 'faker'
import { profiles } from '../fixtures/profile'

const profile = profiles[0]
const productCode = 'FGW07VALLENBM38'

beforeEach(() => {
  cy.login()
  cy.server()
  cy.route('GET', '**/profile/list', 'fixture:profile').as('getProfiles')
  cy.route('**/inner/input-scan', 'fixture:success-response')
  cy.route('**/carton/ping/*', 'fixture:success-response')
  cy.route(/api\/inner\/ping\?barcode/, 'fixture:ping-inner-success')
  cy.visit('/input')
  
  cy.wait(1000)
  cy.get('.v-select__selections').click()
  cy.get('div[role=listitem]').first().click()
  cy.get('#codeInput').type(faker.finance.bic().toUpperCase())
  cy.get('#stepOneNextButton').click()
})

function setAllInput() {
  const productAmount = profile.profileItem[0].amount;
  for (let index = 0; index < productAmount; index++) {
    cy.get('#itemCodeInput').type(`${productCode}{enter}`)
    cy.get('#innerCodeInput').type(`${faker.finance.bic().toUpperCase()}{enter}`)
  }
}

describe('Input menu test', function() {
  it('Should be success create', function() {
    setAllInput()

    cy.get('#saveInputButton').click()
  })

  it('Should be able to remove item that already inserted', function() {
    const productAmount = profile.profileItem[0].amount;
    cy.wait(1000)

    setAllInput()

    cy.get('.delete-input').should('have.length', productAmount)
    cy.get('.delete-input').first().click()
    cy.get('.delete-input').should('have.length', productAmount - 1)
    cy.get('.clear-input').first().click()

    setAllInput()
    cy.get('.delete-input').should('have.length', productAmount)
    cy.get('#saveInputButton').click()
  })
})