import { getPrefixesList } from './config/prefixes.js';

class UrlPrefixService {
    static getPrefix(paramValue) {
        if (!paramValue) return null;
        
        const parts = paramValue.split('-');
        const prefix = parts.length > 1 ? parts[0] : null;
        console.log('Extracted Prefix:', prefix);
        return prefix;
    }

    static isValidPrefix(prefix) {
        const isValid = getPrefixesList().includes(prefix);
        console.log('Is Valid Prefix:', isValid);
        return isValid;
    }
}

export default UrlPrefixService;
