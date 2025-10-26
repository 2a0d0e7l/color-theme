const vscode = require('vscode');

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  console.log('Extension "color-theme" is now active!');

  const COLOR_STATE_KEY = 'colorsChanged';

  const disposable = vscode.commands.registerCommand(
      'my-color-theme.changeColors', async () => {
        const config = vscode.workspace.getConfiguration();
        const colorsChanged =
            context.workspaceState.get(COLOR_STATE_KEY) || false;

        if (!colorsChanged) {
          const currentColors =
              config.get('workbench.colorCustomizations') || {};
          context.workspaceState.update('originalColors', currentColors);


          const randomBackground = getRandomColor();
          const randomForeground = getRandomColor();

          await config.update(
              'workbench.colorCustomizations', {
                ...currentColors,
                'editor.background': randomBackground,
                'editor.foreground': randomForeground
              },
              vscode.ConfigurationTarget.Global);

          context.workspaceState.update(COLOR_STATE_KEY, true);
          vscode.window.showInformationMessage(`Editor colors updated! BG: ${
              randomBackground}, FG: ${randomForeground}`);
        } else {
          const originalColors =
              context.workspaceState.get('originalColors') || {};
          await config.update(
              'workbench.colorCustomizations', originalColors,
              vscode.ConfigurationTarget.Global);

          context.workspaceState.update(COLOR_STATE_KEY, false);
          vscode.window.showInformationMessage(
              'Editor colors restored to default!');
        }
      });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
