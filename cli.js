#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const prompts = require("@clack/prompts");
const { isCancel, cancel, select, text, outro } = prompts;

let radixComponentsPath = "../../contrib/radix/components";
const activeThemePath = process.cwd();

async function listComponents() {
	try {
		const components = await fs.readdirSync(radixComponentsPath);
		console.log("Available Radix Components:");
		for (const componentDir of components) {
			const ymlPath = `${radixComponentsPath}/${componentDir}/${componentDir}.component.yml`;
			if (fs.existsSync(ymlPath)) {
				const fileContents = await fs.readFile(ymlPath, "utf8");
				const doc = yaml.load(fileContents);
				console.log(`- ${doc.name}: ${doc.description}`);
			}
		}

		outro(
			"That's all we have for now, To add a component to your theme, run `drupal-radix-cli add` or to generate a new one `drupal-radix-cli generate`.",
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
					const doc = yaml.load(fs.readFileSync(ymlPath, "utf8"));
					return { value: component, label: doc.name };
				}
				return null;
			})
			.filter(Boolean);

		const maxItems = 10;
		const componentName = await select({
			message: "Pick a Radix component to add to your theme.",
			options: options,
			maxItems: maxItems,
			onCancel: () => {
				cancel("Operation cancelled.");
				process.exit(1);
			},
		});

		if (isCancel(componentName)) {
			cancel("Operation cancelled.");
			process.exit(1);
		}

		const sourcePath = `${radixComponentsPath}/${componentName}`;
		const targetPath = `${activeThemePath}/components/${componentName}`;

		if (fs.existsSync(targetPath)) {
			fs.removeSync(targetPath);
		}

		fs.copySync(sourcePath, targetPath);
		outro(`Component ${componentName} has been added at: ${targetPath}`);
	} catch (error) {
		console.error("Error during the add component process:", error);
	}
}

async function generateComponent() {
	const response = await text({
		message: "What is the name of your component?",
		placeholder: "card",
		onCancel: () => {
			cancel("Operation cancelled.");
			process.exit(1);
		},
	});

	if (isCancel(response)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}

	const componentName = response;

	const componentsDirPath = path.join(activeThemePath, "components");
	const componentDirPath = path.join(componentsDirPath, componentName);

	try {
		if (await fs.pathExists(componentDirPath)) {
			outro(
				`The ${componentName} component already exists, maybe try another name?`,
			);
			process.exit(1);
		}

		await fs.ensureDir(componentsDirPath);
		await fs.ensureDir(componentDirPath);

		const filesToCreate = [
			`${componentName}.twig`,
			`${componentName}.scss`,
			`_${componentName}.js`,
			"README.md",
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
	console.log(`
Usage: drupal-radix-cli [command] [--radix-path <path>]

Commands:
  list            - Displays a list of available Radix components.
  add             - Adds a new component to your theme, replacing the existing one if it's already there.
  generate        - Generates a new component structure within the 'components' directory.
  help            - Shows this help message.

Flags:
  --radix-path    - Optional. Specify the path to the Radix components directory. If not provided, defaults to "../../../contrib/radix/components".
  
You can also use the --help flag to show this help message.
  `);
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
						cancel("Operation cancelled.");
						process.exit(1);
					},
				});

				radixComponentsPath = path.resolve(providedPath);
			} catch (error) {
				if (isCancel(error)) {
					cancel("Operation cancelled.");
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
