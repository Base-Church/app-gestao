export const VALID_PREFIXES = {
    MUSIC: 'music',
    CRTV: 'crtv',
    GERAL: 'geral'
};

export const getPrefixesList = () => Object.values(VALID_PREFIXES);

export const getDefaultPrefix = () => VALID_PREFIXES.GERAL;
