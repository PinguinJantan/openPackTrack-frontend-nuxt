describe('Login test', function() {
  let user = {
    username: 'dikyarga',
    password: 'secret',
  }

  it('Success login', function() {
    cy.server()
    // loads response from "cypress/fixtures/login.json"
    cy.route('POST', '**/auth/login', 'fixture:login')
    cy.route('**/user/me', 'fixture:me')
    cy.visit('/login')
    cy.get('#username').type(user.username)
    cy.get('#password').type(user.password)
    cy.get('#login-button').click()
    cy.url().should('include', '/dashboard')
  })
})