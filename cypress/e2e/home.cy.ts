describe('Home page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/courses', { fixture: 'courses' });
    cy.visit('/');
    cy.contains('All Courses');
    cy.get('mat-card').should('have.length', 9)
  })

  it('should display a list of courses', () => {
    cy.intercept('GET', '/api/courses', { fixture: 'courses' });
    cy.visit('/');
    cy.contains('All Courses');
    cy.get('mat-card').should('have.length', 9)
  });

  it('should display the advanced courses', () => {
    cy.get('.mdc-tab').should('have.length', 2);
    cy.get('.mdc-tab').last().click();
    cy.get('.mat-mdc-card-title').its('length').should('be.gt', 1);
    cy.get('.mat-mdc-card-title').first().should('contain', 'Angular Security');
  });
});
