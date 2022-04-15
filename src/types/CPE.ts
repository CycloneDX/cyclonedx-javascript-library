/**
 * Define the format for acceptable CPE URIs. Supports CPE 2.2 and CPE 2.3 formats.
 * Refer to https://nvd.nist.gov/products/cpe for official specification.
 */
export declare type CPE = string

// eslint-disable-next-line no-useless-escape -- value directly from XML or JSON spec, surrounded with ^$
const cpePattern = /^([c][pP][eE]:\/[AHOaho]?(:[A-Za-z0-9\._\-~%]*){0,6})$|^(cpe:2\.3:[aho\*\-](:(((\?*|\*?)([a-zA-Z0-9\-\._]|(\\[\\\*\?!&quot;#$$%&amp;'\(\)\+,\/:;&lt;=&gt;@\[\]\^`\{\|}~]))+(\?*|\*?))|[\*\-])){5}(:(([a-zA-Z]{2,3}(-([a-zA-Z]{2}|[0-9]{3}))?)|[\*\-]))(:(((\?*|\*?)([a-zA-Z0-9\-\._]|(\\[\\\*\?!&quot;#$$%&amp;'\(\)\+,\/:;&lt;=&gt;@\[\]\^`\{\|}~]))+(\?*|\*?))|[\*\-])){4})$/

export function isCPE (value: any): value is CPE {
  return typeof value === 'string' &&
        cpePattern.test(value)
}
