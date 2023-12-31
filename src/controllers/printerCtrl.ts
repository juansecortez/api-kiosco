// controllers/printerController.ts

import { Request, Response } from "express";
import { exec } from "child_process";

function runPowershellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "${cmd}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(new Error(stderr));
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
}
function runPowershellCommandAsAdmin(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fullCommand = `
        Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command "${cmd}"' -Verb RunAs
      `;
      exec(
        `powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "${fullCommand}"`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          if (stderr) {
            reject(new Error(stderr));
            return;
          }
          resolve(stdout.trim());
        }
      );
    });
  }
  
const printerCtrl = {
  listPrinters: async (req: Request, res: Response) => {
    try {
      const ip = req.params.ip;
      const output = await runPowershellCommand(`net view \\\\${ip}`);

      const lines = output.split("\n");

      const printerLines = lines.slice(
        lines.indexOf(
          "-------------------------------------------------------------------------------"
        ) + 1
      );

      const printers = printerLines
        .filter((line: string) => line.includes("Print"))
        .map((line: string) => line.split(/\s+/)[0]);

      res.json(printers);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  addPrinter: async (req: Request, res: Response) => {
    try {
      const ip = req.params.ip;
      const printerName = req.params.printerName;
      
      const username = "pc\ezamora";
      const password = "Z@morass_2019..";

      const commandToAddPrinter = `
        $password = ConvertTo-SecureString "${password}" -AsPlainText -Force
        $credentials = New-Object System.Management.Automation.PSCredential -ArgumentList "${username}", $password
        Add-Printer -ConnectionName \\\\${ip}\\${printerName} -Credential $credentials
      `;

      await runPowershellCommandAsAdmin(commandToAddPrinter);

      res.json({
        message: "Impresora añadida con éxito",
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  }

};

export default printerCtrl;
