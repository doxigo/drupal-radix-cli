# Close button

A generic close button for dismissing content like modals and alerts.

## Bootstrap Documentation

https://getbootstrap.com/docs/5.3/components/close-button/

Provide an option to dismiss or close a component with .btn-close. Default styling is limited, but highly customizable. Modify the Sass variables to replace the default background-image. Be sure to include text for screen readers, as we’ve done with aria-label.

## Usage

An actual use case is within the Toasts component like so:

```twig
  {% include 'radix:close-button' with {
    attributes: create_attribute({'data-bs-dismiss': 'toast', 'aria-label': 'Close'})
  } %}
```

#### Size (`size`):

Bootstrap button size class
Recommended to use: `btn-sm`, `btn-lg`

#### Disabled state (`disabled`):

Disabled button
