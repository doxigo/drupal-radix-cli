# Fieldset

The fieldset component is used to group related form elements.

## Usage

```twig
    {% embed 'radix:fieldset' with {
      attributes: create_attribute({'class': ['custom-fieldset-class']}).setAttribute('disabled', disabled ? 'disabled' : null),
      disabled: true,
      errors: 'Please correct thegs errors below.',
      required: true,
      legend: {
        title: 'Personal Details',
        attributes: create_attribute({'class': ['custom-legend-class']})
      },
      description: {
        content: 'Please provide your personal details below.',
        attributes: create_attribute({'class': ['custom-description-class']})
      },
      prefix: 'Prefix content goes here',
      suffix: 'Suffix content goes here',
    } %}
      {% block children %}
        <div class="mb-3">
          <label for="disabledTextInput" class="form-label">Disabled input</label>
          <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
        </div>
        <div class="mb-3">
          <label for="disabledSelect" class="form-label">Disabled select menu</label>
          <select id="disabledSelect" class="form-select">
            <option>Disabled select</option>
          </select>
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="disabledFieldsetCheck" disabled>
            <label class="form-check-label" for="disabledFieldsetCheck">
              Can't check this
            </label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      {% endblock %}
    {% endembed %}
```
