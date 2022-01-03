import { dirname } from 'path';
import { fileURLToPath } from 'url';
import i18n from 'i18n';

console.log(i18n, " -------> i18n")

const __dirname = dirname(fileURLToPath(import.meta.url));
i18n.configure({
     locales: ['en', 'ru', 'uk'],
     // directory: path.join(__dirname, 'locales'),
     directory: '/home/user/MyWorks/Wave/locales',
     objectNotation: true
     });

export default i18n