const vscode = require('vscode');
const uglifyJS = require('uglify-js');
const prettier = require('prettier');

function activate(context) {
  let uglifyCommand = vscode.commands.registerCommand('extension.uglifyJs', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const text = document.getText();
      try {
        const uglified = uglifyJS.minify(text);
        if (uglified.error) {
          vscode.window.showErrorMessage(`Uglify error: ${uglified.error}`);
          return;
        }
        editor.edit(editBuilder => {
          const lastLine = document.lineAt(document.lineCount - 1);
          const textRange = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.text.length);
          editBuilder.replace(textRange, uglified.code);
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  });

  let beautifyCommand = vscode.commands.registerCommand('extension.beautifyJs', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const text = document.getText();
      try {
        const beautified = prettier.format(text, { parser: "babel" });
        editor.edit(editBuilder => {
          const lastLine = document.lineAt(document.lineCount - 1);
          const textRange = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.text.length);
          editBuilder.replace(textRange, beautified);
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  });

  context.subscriptions.push(uglifyCommand);
  context.subscriptions.push(beautifyCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
