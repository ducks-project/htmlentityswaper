/**
 * Default character -> HTML entity lookup table.
 *
 * Origin of the data
 * -------------------
 * The pairs below are HTML/Unicode facts: each source character is mapped to a
 * named or numeric HTML character reference that renders the same glyph. The
 * selection of characters (which accented letters and symbols are covered) is
 * credited to the original idea by Enrique Naudon's `enriquein/htmlentity-replacer`
 * extension; only the data table was reused, not the implementation.
 *
 * Corrections applied versus the reference table
 * ----------------------------------------------
 * The reference table is a plain JS object literal, so duplicate keys silently
 * collapse and a few entries are factually wrong. The following fixes are baked
 * into this map and must be preserved:
 *
 * - `œ` -> `&#339;` appeared twice in the reference (identical key/value); kept
 *   once here.
 * - `Ÿ` -> `&#376;` appeared twice in the reference (identical key/value); kept
 *   once here.
 * - `İ` was declared twice with diverging values (`&#304;` then `&#305;`). The
 *   first is correct: U+0130 `İ` (Latin capital I with dot above) is `&#304;`.
 *   The second clearly targeted U+0131 `ı` (Latin small dotless i) = `&#305;`,
 *   so it is stored under the correct key `ı` instead of overwriting `İ`.
 * - `ā` (U+0101, Latin small a with macron) was mapped to `&auml;` (a-umlaut)
 *   in the reference, which is wrong. Corrected to its numeric reference
 *   `&#257;`. Note `ä` -> `&auml;` stays untouched.
 * - The double-quote character `"` is intentionally excluded: it is never
 *   replaced by default (replacing it is almost always unwanted in markup).
 *
 * Immutability
 * ------------
 * The table is exposed as a frozen `ReadonlyMap`. Overrides are layered on top
 * at build time by `EntityMapBuilder`, never by mutating this map.
 */

/**
 * Ordered, deduplicated, corrected character -> HTML entity pairs.
 *
 * Kept as a tuple array (not an object literal) so the source cannot silently
 * collapse duplicate keys and the entry count stays auditable by tests.
 */
const DEFAULT_ENTITY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['Á', '&Aacute;'],
  ['á', '&aacute;'],
  ['Â', '&Acirc;'],
  ['â', '&acirc;'],
  ['À', '&Agrave;'],
  ['à', '&agrave;'],
  ['Å', '&Aring;'],
  ['å', '&aring;'],
  ['Ã', '&Atilde;'],
  ['ã', '&atilde;'],
  ['Ä', '&Auml;'],
  // Correction: reference mapped `ā` to `&auml;`; `ā` (U+0101) is a-macron.
  ['ā', '&#257;'],
  ['Ă', '&#258;'],
  ['ă', '&#259;'],
  ['Ą', '&#260;'],
  ['ą', '&#261;'],
  ['ä', '&auml;'],
  ['Æ', '&AElig;'],
  ['æ', '&aelig;'],
  ['¢', '&cent;'],
  ['œ', '&#339;'],
  ['Ć', '&#262;'],
  ['ć', '&#263;'],
  ['Ĉ', '&#264;'],
  ['ĉ', '&#265;'],
  ['Ċ', '&#266;'],
  ['ċ', '&#267;'],
  ['Č', '&#268;'],
  ['č', '&#269;'],
  ['Ď', '&#270;'],
  ['ď', '&#271;'],
  ['Đ', '&#272;'],
  ['đ', '&#273;'],
  ['Ð', '&ETH;'],
  ['É', '&Eacute;'],
  ['é', '&eacute;'],
  ['Ê', '&Ecirc;'],
  ['ê', '&ecirc;'],
  ['È', '&Egrave;'],
  ['è', '&egrave;'],
  ['Ë', '&Euml;'],
  ['ë', '&euml;'],
  ['Ē', '&#274;'],
  ['ē', '&#275;'],
  ['Ĕ', '&#276;'],
  ['ĕ', '&#277;'],
  ['Ė', '&#278;'],
  ['ė', '&#279;'],
  ['Ę', '&#280;'],
  ['ę', '&#281;'],
  ['Ě', '&#282;'],
  ['ě', '&#283;'],
  ['ƒ', '&#402;'],
  ['Ĝ', '&#284;'],
  ['ĝ', '&#285;'],
  ['Ğ', '&#286;'],
  ['ğ', '&#287;'],
  ['Ġ', '&#288;'],
  ['ġ', '&#289;'],
  ['Ģ', '&#290;'],
  ['ģ', '&#291;'],
  ['Ĥ', '&#292;'],
  ['ĥ', '&#293;'],
  ['Ħ', '&#294;'],
  ['ħ', '&#295;'],
  ['ð', '&eth;'],
  ['Í', '&Iacute;'],
  ['í', '&iacute;'],
  ['Î', '&Icirc;'],
  ['î', '&icirc;'],
  ['Ì', '&Igrave;'],
  ['ì', '&igrave;'],
  ['Ï', '&Iuml;'],
  ['ï', '&iuml;'],
  ['Ĩ', '&#296;'],
  ['ĩ', '&#297;'],
  ['Ī', '&#298;'],
  ['ī', '&#299;'],
  ['Ĭ', '&#300;'],
  ['ĭ', '&#301;'],
  ['Į', '&#302;'],
  ['į', '&#303;'],
  // Correction: U+0130 capital I with dot above.
  ['İ', '&#304;'],
  // Correction: reference re-used key `İ` for `&#305;`; that value is U+0131
  // small dotless i, stored here under its correct key `ı`.
  ['ı', '&#305;'],
  ['Ĳ', '&#306;'],
  ['ĳ', '&#307;'],
  ['Ĵ', '&#308;'],
  ['ĵ', '&#309;'],
  ['Ķ', '&#310;'],
  ['ķ', '&#311;'],
  ['Ĺ', '&#313;'],
  ['ĺ', '&#314;'],
  ['Ļ', '&#315;'],
  ['ļ', '&#316;'],
  ['Ľ', '&#317;'],
  ['ľ', '&#318;'],
  ['Ł', '&#321;'],
  ['ł', '&#322;'],
  ['Ń', '&#323;'],
  ['ń', '&#324;'],
  ['Ņ', '&#325;'],
  ['ņ', '&#326;'],
  ['Ň', '&#327;'],
  ['ň', '&#328;'],
  ['ŋ', '&#331;'],
  ['Ó', '&Oacute;'],
  ['ó', '&oacute;'],
  ['Ô', '&Ocirc;'],
  ['ô', '&ocirc;'],
  ['Ò', '&Ograve;'],
  ['ò', '&ograve;'],
  ['Ø', '&Oslash;'],
  ['ø', '&oslash;'],
  ['Õ', '&Otilde;'],
  ['õ', '&otilde;'],
  ['Ö', '&Ouml;'],
  ['ö', '&ouml;'],
  ['Ō', '&#332;'],
  ['ō', '&#333;'],
  ['Ŏ', '&#334;'],
  ['ŏ', '&#335;'],
  ['Ő', '&#336;'],
  ['ő', '&#337;'],
  ['Œ', '&#338;'],
  // Note: `œ` already defined above; duplicate from the reference dropped here.
  ['Ŕ', '&#340;'],
  ['ŕ', '&#341;'],
  ['Ŗ', '&#342;'],
  ['ŗ', '&#343;'],
  ['Ř', '&#344;'],
  ['ř', '&#345;'],
  ['Ś', '&#346;'],
  ['ś', '&#347;'],
  ['Ŝ', '&#348;'],
  ['ŝ', '&#349;'],
  ['Ş', '&#350;'],
  ['ş', '&#351;'],
  ['Ș', '&#536;'],
  ['ș', '&#537;'],
  ['Š', '&#352;'],
  ['š', '&#353;'],
  ['Ţ', '&#354;'],
  ['ţ', '&#355;'],
  ['Ț', '&#538;'],
  ['ț', '&#539;'],
  ['Ť', '&#356;'],
  ['ť', '&#357;'],
  ['Ŧ', '&#358;'],
  ['ŧ', '&#359;'],
  ['Ú', '&Uacute;'],
  ['ú', '&uacute;'],
  ['Û', '&Ucirc;'],
  ['û', '&ucirc;'],
  ['Ù', '&Ugrave;'],
  ['ù', '&ugrave;'],
  ['Ü', '&Uuml;'],
  ['ü', '&uuml;'],
  ['µ', '&micro;'],
  ['Ũ', '&#360;'],
  ['ũ', '&#361;'],
  ['Ū', '&#362;'],
  ['ū', '&#363;'],
  ['Ŭ', '&#364;'],
  ['ŭ', '&#365;'],
  ['Ů', '&#366;'],
  ['ů', '&#367;'],
  ['Ű', '&#368;'],
  ['ű', '&#369;'],
  ['Ų', '&#370;'],
  ['ų', '&#371;'],
  ['Ŵ', '&#372;'],
  ['ŵ', '&#373;'],
  ['Ŷ', '&#374;'],
  ['ŷ', '&#375;'],
  ['Ÿ', '&#376;'],
  ['Ź', '&#377;'],
  ['ź', '&#378;'],
  ['Ż', '&#379;'],
  ['ż', '&#380;'],
  ['Ž', '&#381;'],
  ['ž', '&#382;'],
  ['Ç', '&Ccedil;'],
  ['ç', '&ccedil;'],
  ['Ñ', '&Ntilde;'],
  ['ñ', '&ntilde;'],
  ['§', '&sect;'],
  ['®', '&reg;'],
  ['©', '&copy;'],
  ['Ý', '&Yacute;'],
  ['ý', '&yacute;'],
  ['ÿ', '&yuml;'],
  // Note: `Ÿ` already defined above; duplicate from the reference dropped here.
  ['Þ', '&THORN;'],
  ['þ', '&thorn;'],
  ['ß', '&szlig;'],
  ['£', '&pound;'],
  ['¥', '&yen;'],
  ['€', '&euro;'],
  ['¿', '&iquest;'],
  ['¡', '&iexcl;'],
  ['™', '&trade;'],
  ['℠', '&#8480;'],
  ['°', '&deg;'],
  ['º', '&ordm;'],
  ['ª', '&ordf;'],
];

/**
 * Immutable default entity table, ready for O(1) character lookups.
 *
 * Frozen so no consumer can mutate the shared defaults; `EntityMapBuilder`
 * layers user overrides on a private copy rather than touching this map.
 */
export const DEFAULT_ENTITIES: ReadonlyMap<string, string> = Object.freeze(
  new Map<string, string>(DEFAULT_ENTITY_PAIRS),
);
