# Badge

## Bootstrap Documentation

https://getbootstrap.com/docs/5.3/components/badge/

## Available Properties:

#### HTML Tag (`html_tag`):

The HTML tag to use for the badge.

Recommended to use: `span` | `div` | `a`

Default value: `span`

#### Background and Text Color (`color`):

Background and Text Color. Set a `background-color` with contrasting
foreground color with our `.text-bg-{color}` helpers. Previously it
was required to manually pair your choice of `.text-{color}`

and `.bg-{color}` utilities for styling, which you still may use if you prefer.

Recommended to use: `-primary` | `secondary` | `success` |
`info` | `warning` | `danger` |
`light` | `dark`

Default value: `secondary`

#### Content (`content`):

The content of the badge.

#### URL Link (`url`):

The HTML tag will automatically be set to a if an anchor is added to the URL.

#### Utility Classes (`utility_classes`):

This property contains an array of utility classes that can be used to
add extra Bootstrap utility classes or custom classes to this component.

### Examples

**Example #1:** New post badge.

```twig
  {% include 'radix:badge' with {
    html_tag: 'a',
    color: 'text-bg-primary',
    url: forum.new_url,
    content: forum.new_text
  } %}
```

**Example #2:** Pill badges with success content

```twig
  {% include 'radix:badge' with {
    html_tag: 'span',
    color: 'text-bg-success'
    content: 'Success',
    utility_classes: ['rounded-pill']
  } %}
```
