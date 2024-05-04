#!/usr/bin/env node
const path = require("node:path");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const prompts = require("@clack/prompts");
const { isCancel, cancel, select, text, intro, outro, confirm } = prompts;
const color = require('picocolors');

let radixComponentsPath = "../../contrib/radix/components";
const activeThemePath = process.cwd();

async function listComponents() {
  try {
    intro(color.magenta(`Available ${color.bold("Radix")} Components:`));
    const components = await fs.readdirSync(radixComponentsPath);
    for (const componentDir of components) {
      const ymlPath = `${radixComponentsPath}/${componentDir}/${componentDir}.component.yml`;
      if (fs.existsSync(ymlPath)) {
        const fileContents = await fs.readFile(ymlPath, "utf8");
        const doc = yaml.load(fileContents);
        if (doc?.name) {
          const description = doc.description || 'No description available';
          console.log(`- ${color.magenta(doc.name)}: ${description}`);
        }
      }
    }

    outro(
      color.magenta(`That's all. To add a component to your theme, run ${color.inverse("drupal-radix-cli add")} or to generate a new one ${color.inverse("drupal-radix-cli generate")}.`)
    );
  } catch (error) {
    console.error("Error listing components:", error);
  }
}

async function addComponent() {
  try {
      const components = fs.readdirSync(radixComponentsPath);
      const options = components
          .map((component) => {
              const ymlPath = `${radixComponentsPath}/${component}/${component}.component.yml`;
              if (fs.existsSync(ymlPath)) {
                  const fileContents = fs.readFileSync(ymlPath, "utf8");
                  const doc = yaml.load(fileContents);
                  if (doc?.name) {
                      return { value: component, label: doc.name };
                  }
              }
              return null;
          })
          .filter(Boolean);

      if (options.length === 0) {
          outro(color.yellow("No components available to add."));
          return;
      }

      const maxItems = 8;
      const componentName = await select({
          message: "Pick a Radix component to add to your theme.",
          options: options,
          maxItems: maxItems,
          onCancel: () => {
              cancel("Operation cancelled.");
              process.exit(0);
          },
      });

      if (isCancel(componentName)) {
          cancel("Operation cancelled.");
          process.exit(0);
      }

      const sourcePath = `${radixComponentsPath}/${componentName}`;
      const targetPath = `${activeThemePath}/components/${componentName}`;

      if (fs.existsSync(targetPath)) {
          // Ask user if they want to overwrite the existing component
          const overwrite = await confirm({
              message: `${componentName} already exists. Do you want to overwrite it?`,
              initial: false
          });

          if (isCancel(overwrite) || !overwrite) {
              outro(color.yellow(`Operation cancelled. ${componentName} was not overwritten.`));
              process.exit(0);
          }

          fs.removeSync(targetPath);
      }

      fs.copySync(sourcePath, targetPath);
      outro(color.magenta(`Component ${componentName} has been added at: ${color.bold(targetPath)}`));
  } catch (error) {
      console.error("Error during the add component process:", error);
  }
}


async function generateComponent() {
	const response = await text({
		message: "What is the name of your component?",
		placeholder: "eg. card",
		onCancel: () => {
			cancel(outro(color.yellow(`"Operation cancelled."`)));
			process.exit(0);
		},
	});

	if (isCancel(response)) {
    cancel(outro(color.yellow(`"Operation cancelled."`)));
		process.exit(0);
	}

	const componentName = response;

	const componentsDirPath = path.join(activeThemePath, "components");
	const componentDirPath = path.join(componentsDirPath, componentName);

	try {
		if (await fs.pathExists(componentDirPath)) {
			outro(
				color.yellow(`The ${color.italic(componentName)} component already exists! maybe try another name?`)
			);
			process.exit(0);
		}

		await fs.ensureDir(componentsDirPath);
		await fs.ensureDir(componentDirPath);

		const filesToCreate = [
			`${componentName}.twig`,
			`${componentName}.scss`,
			`_${componentName}.js`,
			"README.mdx",
			`${componentName}.component.yml`,
		];

		for (const file of filesToCreate) {
			const filePath = path.join(componentDirPath, file);
			await fs.ensureFile(filePath);
		}

		// Initial content for the SCSS file
		const scssFilePath = path.join(componentDirPath, `${componentName}.scss`);
		await fs.appendFile(scssFilePath, '@import "../../src/scss/init";\n');

		// Initial content for the component YML file
		const componentYmlPath = path.join(
			componentDirPath,
			`${componentName}.component.yml`,
		);
		const componentYmlContent = `$schema: https://git.drupalcode.org/project/drupal/-/raw/10.1.x/core/modules/sdc/src/metadata.schema.json
name: ${componentName}
status: experimental
description: 'The ${componentName} component auto-generated by drupal-radix-cli'
`;

		await fs.writeFile(componentYmlPath, componentYmlContent);

		// Initial content for the component README file
		const readmeMdPath = path.join(componentDirPath, "README.md");
		const readmeMdContent = `# ${componentName} Component

This component was generated by the \`drupal-radix-cli\` tool. Feel free to update this README to provide more information about your component and how to use it.`;
		await fs.writeFile(readmeMdPath, readmeMdContent);

		// Initial content for the twig file
		const twigFilePath = path.join(componentDirPath, `${componentName}.twig`);
		const twigCommentBlock = `{#
/**
* @file
* Template for ${componentName} component.
*/
#}`;
		await fs.writeFile(twigFilePath, twigCommentBlock);

		console.log(
			`Component ${componentName} generated successfully. Make sure to remove anything that you don't need and update your ${componentName}.component.yml file.`,
		);
	} catch (error) {
		console.error("Error generating component:", error);
		process.exit(1);
	}
}

function showHelp() {
	intro(`
${color.magenta("Usage: drupal-radix-cli [command] [--radix-path <path>]")}

Commands:
  ${color.green("list")}            - Displays a list of available Radix components.
  ${color.green("add")}             - Adds a new component to your theme, replacing the existing one if it's already there.
  ${color.green("generate")}        - Generates a new component structure within the 'components' directory.
  ${color.green("help")}            - Shows this help message.

Flags:
${color.green("--radix-path")}    - Optional. Specify the path to the Radix components directory. If not provided, defaults to "../../../contrib/radix/components".
`);
  outro(color.magenta("You can also use the --help flag to show this help message."))
}

(async () => {
	const args = process.argv.slice(2);
	const radixPathFlagIndex = args.findIndex((arg) => arg === "--radix-path");

	if (radixPathFlagIndex > -1) {
		let providedPath = args[radixPathFlagIndex + 1];
		if (!providedPath) {
			try {
				providedPath = await text({
					message: "Enter the path to the Radix components directory:",
					placeholder: "../../../contrib/radix/components",
					onCancel: () => {
						cancel(outro(color.yellow(`"Operation cancelled."`)));
						process.exit(0);
					},
				});

				radixComponentsPath = path.resolve(providedPath);
			} catch (error) {
				if (isCancel(error)) {
					cancel(outro(color.yellow(`"Operation cancelled."`)));
					process.exit(1);
				} else {
					console.error("An unexpected error occurred:", error);
					process.exit(1);
				}
			}
		} else {
			radixComponentsPath = path.resolve(providedPath);
		}
	}

	const command = args[0] || "help";

	try {
		if (command === "list") {
			await listComponents();
		} else if (command === "add") {
			await addComponent();
		} else if (command === "generate") {
			await generateComponent();
		} else if (command === "help") {
			showHelp();
		} else {
			console.log(`Unknown command: ${command}`);
			showHelp();
		}
	} catch (error) {
		console.error("An error occurred:", error);
		process.exit(1);
	}
})();
