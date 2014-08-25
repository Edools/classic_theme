# Edools - Themes and CMS
The Edools theme system is an AngularJS based app that defines a set of standard templates to enable the customization of layout and data to a school site.

This document's objective is to build the documentation about our CMS. It should have the conceptual part of it and instruct about the creation of a theme.


## Getting Started

To get a ready-to-go environment for a new school, start cloning this reposutory.

### Environment setup

To start a brand new school, start a new branch from `master` and run:

- `npm install`
- `bower install`
- `grunt serve`

### General tips

#### Styles

You have full access to the `index.html`, so you can add new scripts and/or stylesheets.


#### Scripts
Your scripts should run according to events the application send you. There's one event being sent for each page.


#### States
There's a new `schooljs` version coming that dropped the `school.content` from the UI states. So, for example: it's not `school.content.home` anymore, it's now `school.home`.


#### Creating links on a template
You'll need them for creating links too. Use the `ui-sref` directive in a link element to create a link to a state. E.g.:
```html
<a ui-sref="school.home">Link para a home</a>

<!-- Passando um parâmetro para um link -->
<a ui-sref="school.course({ courseId: course.id })">Link para a página de um curso (vc deve ter esse curso no contexto do seu template)</a>
```

### Directory structure
```
├── assets
    ├── fonts
    ├── images
    ├── scripts
    ├── styles
├── schemas
    ├── course.json
    ├── courses.json
    ├── home.json
    ├── page.json
    └── student
        ├── dashboard
        |   ├── contact.json
        |   ├── content.json
        |   ├── course.json
        |   ├── enrollments.json
├──templates
    ├── checkout
    │   ├── cart.html
    │   ├── complete.html
    │   ├── connect.html
    │   ├── payment.html
    │   └── success.html
    ├── contentNode.html
    ├── course.html
    ├── courses.html
    ├── home.html
    ├── layout.html
    ├── page.html
    └── student
        ├── dashboard
        │   ├── contact.html
        │   ├── content.html
        │   ├── contentNode.html
        │   ├── course.html
        │   └── enrollments.html
        ├── login.html
        └── register.html
├── index.html
├── favicon.ico
```

### `layout.html`
Base template, containing base header and footer.

#### Variables

- $session (the current session information)

### `home.html`
School's home content

#### Variables

- School Products
- Categories

### `courses.html`
School courses listing

#### Variables

- School Products
- Categories

#### Functions

- hasCategory - Verifies if the school product has a category

### `course.html`
Course detail page

#### Variables

- School Product
- School Product Topics
- Course Modules & Contents

#### Functions

- hasCategory - Verifies if the school product has a category

### `page.html`
Static page template

#### Variables

- Title
- Content

### `student/login.html`
Student's login page

### `student/register.html`
Student's register page

### `student/dashboard/enrollments.html`
Student's dashboard main page. Shows the courses he's enrolled

#### Variables

- Enrollments

### `student/dashboard/course.html`
Course consumption first page, with forum question, reviews and progress

#### Variables

- School Product
- Course Modules & Contents
- Reviews
- Forum Questions
- Lesson Progress

### `student/dashboard/content.html`
Course consumption page

#### Variables

- Media
- Lesson
- School Product
- Course Modules & Contents
- Forum Questions


### `student/dashboard/contact.html`
Student's dashboard page to contact the school

#### Variables

- Messages

## Schemas
Allow the user to define a `schema`, for transforming the data on pages. Creating new properties for context variables or event new context variables, to be used on the templates.

Examples:

- Changing the properties of a certain context variable:
```json
{
  "models": {
    "school_product": {
      "promo": "hasCategory('Promoção')(obj)"
    }
  }
}
```
- Creating new variables to use on a page, based on the ones that already exists:
```json
{
  "topo": "_.sample(_.filter(school_products, hasCategory('Topo')))",
  "destaque": "_.filter(school_products, hasCategory('Destaque'))",
  "cursos": "school_products"
}
```
