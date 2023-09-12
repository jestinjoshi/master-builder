const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 460,
		height: 300,
		center: true,
		resizable: false,
		darkTheme: true,
		autoHideMenuBar: true,
			webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			enableRemoteModule: false,
			contextIsolation: true,
			sandbox: true,
			devTools: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	ipcMain.on('select-dirs', async () => {
		const result = await dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory']
		})

		mainWindow.webContents.send('directory', result);
	});

	ipcMain.on('run-command', (event, data) => {
		run_script(data);
	});

	// This function will output the lines from the script 
	// and will return the full combined output
	// as well as exit code when it's done (using the callback).
	function run_script(data, args, callback) {
		console.log(data);
		var child = spawn(data.command, args, {
			encoding: 'utf8',
			shell: true,
			detached: true,
			...data
		});
		// You can also use a variable to save the output for when the script closes later
		child.on('error', (error) => {
			dialog.showMessageBox({
				title: 'Error',
				type: 'warning',
				message: 'Error occured.\r\n' + error
			});
		});

		child.stdout.setEncoding('utf8');
		child.stdout.on('data', (data) => {
			//Here is the output
			data = data.toString();
			console.log(data);
		});

		child.stderr.setEncoding('utf8');
		// child.stderr.on('data', (data) => {
		// 	// Return some data to the renderer process with the mainprocess-response ID
		// 	mainWindow.webContents.send('mainprocess-response', data);
		// 	//Here is the output from the command
		// 	console.log(data);
		// });

		child.on('close', (code) => {
			//Here you can get the exit code of the script  
			console.log(code);
			dialog.showMessageBox({
				message: `Your build is completed`
			});
		});

		if (typeof callback === 'function')
			callback();
	}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.