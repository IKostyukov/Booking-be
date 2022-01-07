import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import i18n from 'i18n';

console.log(i18n.configure, " -------> i18n from i18n.js")

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultLocale = 'en'
const locales = ['en', 'ru', 'uk']

i18n.configure({
     locales: locales,
     directory: path.join(__dirname, 'locales'),
     defaultLocale: defaultLocale,
     objectNotation: true
     });


export default function(req, res, next) {
     let headers = req.headers;
     let lang = '';
     if (req.headers.hasOwnProperty('accept-language') && locales.includes(headers['accept-language'])) {  // проверка на налиние параметров
          lang = headers['accept-language'];
     }else{    
          lang = defaultLocale;
     }     
     i18n.init(req, res);
     i18n.setLocale(lang);
     return next();
};