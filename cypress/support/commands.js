// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => { 
  window.localStorage.setItem('auth._token.local', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTU1NzY0MTQzOCwiZXhwIjoxNTU3NzI3ODM4fQ.o5dGgMESHs-VHk2e685NzwkePUek_WbhjcIp-UFR6v0')
  window.localStorage.setItem('auth.redirect', '/dashboard')
  cy.setCookie('auth._token.local', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTU1NzY0MTQzOCwiZXhwIjoxNTU3NzI3ODM4fQ.o5dGgMESHs-VHk2e685NzwkePUek_WbhjcIp-UFR6v0')
})