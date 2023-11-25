# Radix Drupal CLI

Radix Drupal CLI is a command-line interface designed to manage [Drupal Radix 6](https://www.drupal.org/project/radix) components. It allows for easy listing and adding of components to your Drupal theme, leveraging the power of the Radix base theme.

_Note_: that this CLI uses your own local Radix theme as a source for components. If you want to add components from the latest version of Radix, you must first update your local Radix theme.

## Features

- **List Components**: Display all available Radix components.
- **Add Components**: Add Radix components to your theme, automatically replacing any existing ones.

## Installation

Ensure you have Node.js and npm installed on your system. Install the CLI tool globally via npm:

```bash
npm install -g radix-drupal-cli
```

## Usage

Once installed, you can use the CLI tool with the following commands:

### List Components

To list all Radix components available in the default directory:

```bash
radix-drupal-cli list
```

### Add Components

To add a Radix component to your current theme:

```bash
radix-drupal-cli add
```

Use the `--radix-path` flag to specify a custom Radix components directory if your Radix base theme is installed in a non-standard location:

```bash
radix-drupal-cli add --radix-path ../../radix/components
```

## Help

Display usage instructions:

```bash
radix-drupal-cli --help
```

Or simply `radix-drupal-cli`.

## Radix Theme

The Radix theme is a component-base theme for Drupal. For more information, visit the [Radix theme project page on Drupal.org](https://www.drupal.org/project/radix).

## Contributing

Contributions are welcome! Submit pull requests or create issues for any enhancements, bugs, or features.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
