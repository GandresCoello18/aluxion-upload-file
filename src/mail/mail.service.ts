/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
import { LoggerService } from '../shared/logger/logger.service';
import * as path from 'path';
import * as fs from 'fs';
const mjml2html = require('mjml');

@Injectable()
export class MailService {
  private readonly logger = new LoggerService();
  private templatesPath = path.join(__dirname, './templates/main');

  constructor(private configService: ConfigService) {
    sgMail.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY') as string,
    );
  }

  private async loadTemplate(
    templateName: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const templatePath = path.join(this.templatesPath, `${templateName}.mjml`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`El archivo ${templateName}.mjml no existe.`);
    }

    let mjmlContent = await fs.promises.readFile(templatePath, 'utf8');

    Object.entries(variables).forEach(([key, value]) => {
      mjmlContent = mjmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    const { html, errors } = mjml2html(mjmlContent);

    if (errors.length) {
      if (errors[0] instanceof Error) {
        this.logger.error(`Errores en MJML: `, errors[0].message);
      }
    }

    return html as string;
  }

  async generateEmail(options: {
    template: string;
    variables: Record<string, string>;
  }) {
    return await this.loadTemplate(options.template, options.variables);
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const msg = {
      ...options,
      from: {
        name: 'Aluxion / Andres Coello',
        email: this.configService.get<string>('INFO_EMAIL_BOTCA'),
      },
    };

    try {
      await sgMail.send(msg as MailDataRequired);
      this.logger.log('Correo enviado con éxito');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('Error al enviar el correo', e.message);
        throw e;
      }
    }
  }
}
