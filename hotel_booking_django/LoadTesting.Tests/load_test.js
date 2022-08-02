import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from "k6/http";
import { check, group, sleep, fail } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages:[
        {duration: '1m', target:10}, 
        {duration: '10m', target:20},
        {duration: '5m', target:0}, 
    ],
    thresholds: {
        http_req_duration: ["p(99)<150"]
    }
};

function randomString(length, charset = '') {
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

const USERNAME = `${randomString(10)}@example.com`;
const PASSWORD = 'loadTEST123!@#';
const BASE_URL = 'http://localhost:8000';

function allAreTrue(arr) {
  return arr.every(element => element === true);
}

// function choose_random_dest(){
//   const dist_id_choices = ["A6Dz", "WP3Z", "jC3Y", "vJh2", "P4FZ", "FkG9", "EWUH", "I7E8", "9KUU", "6FXD", "Zauv", "C7r0", "cm8g", "CL8I", "4XcC", "0zyy", "UHQ6", "fCWp", "5NM2", "PCFH", "S3PK", "134B", "C5AK", "wHMg", "SoGS", "wU1v", "AqIc", "Dvb4", "xmXl", "YCcf", "lL9x", "0ZF7", "p5Lz", "lDcw", "N23M", "cvRb", "mX8x", "eTo1", "3Syx", "jv4W", "jYwQ", "n2cH", "QVAr", "UFv4", "m2Xo", "sR1F", "RsLO", "4FBY", "KSAd", "cCxV", "U2Y0", "698L", "XwkL", "GUJI", "QoqG", "FNB4", "87DY", "jeIv", "dCpi", "AWIM", "bfGz", "z5kp", "tOik", "CDH6", "l0RE", "XQuf", "Bjlx", "UUv9", "HOJW", "jiHz", "jxt1", "t4Pi", "M96F", "OWEQ", "AZRW", "YmVS", "wCJo", "PKE3", "RTDF", "1HRA", "kOTa", "fRZM", "NVWV", "lVwl", "QtoU", "L09B", "MO7Z", "iSef", "D8Qs", "p2T5", "Z6TC", "EzoR", "2T7t", "qlef", "9Tgw", "SfLK", "S5DP", "Z36S", "Ab2i", "pJBt", "HRiV", "1PLC", "RjNn", "n6V8", "oWA8", "cdNS", "WM3I", "ykBH", "x9rh", "UZL7", "H1cz", "3AUC", "62Vt", "R98r", "mqNJ", "FQ9X", "XUAZ", "QrXv", "4DVY", "XDT1", "vJQX", "CJid", "N25D", "90bR", "ofhC", "5qq3", "YIQj", "z3Ag", "4VAU", "jSgG", "mopK", "AzfD", "Nk1G", "C47r", "uyW4", "L7nM", "AWGv", "8J8o", "qYyQ", "7ZHc", "bPME", "ftAR", "7Ik6", "6qzv", "5H1u", "66cp", "D3WS", "a6Er", "aDTM", "NHEU", "LW5w", "yMHz", "UppB", "6MYW", "CCC7", "1cwQ", "yt08", "w9lq", "ctn4", "5DSY", "RSUV", "G66P", "FPHC", "RE3B", "K48G", "SYIl", "BKPC", "wuRn", "blCB", "d58N", "UQ6K", "TVSI", "YYxz", "FOF5", "EUlE", "7PIK", "K8r6", "A5R8", "4WoS", "L1S5", "4IQZ", "1ru6", "GYwr", "xbQr", "MNk3", "MLAS", "49TW", "fGQw", "q09q", "VJTY", "Q28P", "sEbi", "OBZO", "H9O2", "OSjV", "P3NO", "dvPk", "Ye0u", "UR2X", "3lVb", "gstt", "U4NJ", "kUqS", "PczS", "DyKs", "SVa6", "53J8", "8LVA", "3IUE", "8CEO", "ZDzQ", "dBCy", "BOaZ", "lapb", "9ZOW", "xoU5", "G5TK", "A571", "Lqhs", "WL7W", "mRAg", "U3Z4", "Y4UD", "H4Gp", "N1IN", "B0UW", "cRGz", "L1PP", "SI4F", "BMPW", "7NFG", "3S0Y", "irzv", "Xeo1", "XLPW", "kYwL", "YO8U", "6M9I", "51BL", "uyak", "7LyP", "UqdH", "h9JC", "OcRT", "F4lN", "XB41", "CCcM", "1iQo", "72Y9", "boWi", "eBUL", "W1HH", "IAR8", "UMIL", "5ac3", "pS0H", "jX05", "UF46", "MO9E", "CLR7", "lOaA", "H4a3", "NGBK", "iwax", "1V10", "QCRB", "JED7", "Zqom", "P7VK", "IGdF", "BB32", "T2pu", "8N6N", "AH9J", "KOrK", "nGUB", "B8Wy", "1tsh", "Tfab", "M7U8", "VKGY", "eztw", "Zzfe", "0EpJ", "vXA7", "GX0I", "v2XW", "DT1R", "PTbx", "5HFJ", "XBJJ", "M7Ou", "NJE6", "7hpc", "eg24", "A5o6", "JsE0", "FN9A", "zTL8", "YRKT", "brNF", "kEiE", "CukB", "qTEw", "6m2N", "wrQr", "3WO5", "VQer", "svJm", "c6jH", "kSF7", "uZDi", "2EFq", "UHjy", "TStZ", "2PyR", "JJfJ", "Hboz", "4ZI7", "ev2C", "YJXA", "vdLu", "E9bC", "dJxW", "Hsg9", "lnS2", "WaLc", "lgl8", "ya1n", "jUC9", "Dotr", "mfjs", "EE6i", "qn7I", "5ZSM", "nlTN", "RsBU", "vkcm", "AB9S", "SW2V", "IZ5L", "HA3p", "FDZ4", "5E5N", "wf6u", "EoLi", "aep5", "QuLO", "ru2E", "hLbr", "97Uw", "fvHk", "YC0K", "rcyx", "AV4R", "NJ06", "LoK3", "RaDi", "IRHI", "V3A3", "G2D9", "Md45", "HTLZ", "EZ0I", "5tJD", "Y7LU", "3M3D", "crMb", "HGHH", "GBIC", "beGI", "cXWK", "pq3k", "775W", "JQ3P", "1dxY", "a9q0", "SCMJ", "ZxbF", "ngKm", "AY7x", "W1T5", "UIIo", "T9j6", "IAOH", "x078", "kncs", "XtA1", "zjTT", "YQSp", "u0ym", "f5OK", "K1CT", "MFHB", "EnnT", "6GCJ", "FmA6", "ZUG8", "OO44", "K5CF", "mFIZ", "QgMi", "FB97", "OEO8", "dzgx", "YyrL", "W7lt", "OLRx", "T5IU", "28OM", "sLjp", "MeyU", "RII2", "NTut", "SODV", "42VS", "eHui", "SJJK", "M5mX", "UJ7r", "wCL1", "DRKH", "BZIZ", "xr6h", "ghtW", "dMSl", "TYR6", "2Uuh", "nswi", "WL0B", "RTlP", "7MTJ", "Nsdz", "9GfK", "mO1Y", "qXGb", "BFUT", "WVYA", "6IZQ", "L6mX", "YhrB", "YasP", "1t74", "t4jE", "pmjs", "29pw", "LQDb", "L3Ie", "2cAa", "T2MX", "RO7Y", "F29P", "o5Ch", "Ioax", "p3nr", "ULxh", "QWHV", "5Lua", "ROPG", "dBHe", "z6hZ", "dW80", "Pr3c", "BRCQ", "RJ49", "FD33", "E9rn", "jlpB", "olLJ", "8JGF", "VNC6", "Hp6z", "2AAW", "kZT5", "yHBk", "HqPJ", "P0pd", "SgzA", "P20D", "MqE2", "E49f", "dZEW", "JHHN", "djfA", "UeJI", "N2CI", "5ik9", "udGf", "K7MU", "PyvZ", "12R0", "rFvb", "VQqI", "yI92", "oD3K", "jYxm", "pou0", "akiO", "3BS3", "rLGS", "3xD7", "prNB", "3GTE", "OKyC", "TKOV", "ITBS", "mp7y", "lWL7", "A64n", "LLg0", "oeFj", "iV1L", "bvq9", "ar4O", "JB51", "GVPf", "6Ewz", "NrBr", "rxhG", "8BUB", "qfQ0", "hR7H", "B344", "W4AV", "RjX0", "RacI", "GFLZ", "445I", "RUvj", "9Khj", "La9L", "KSKq", "NS2R", "1seo", "iBT4", "iILR", "Nfy5", "dYcy", "VGHG", "o4r2", "b5HM", "XXvn", "qB5H", "XtN4", "3jBy", "0J2P", "YAV6", "JW8K", "8fGD", "gXE4", "gTuj", "ZQl7", "40bK", "GRCD", "PTZ5", "oXhz", "mCBH", "ZneZ", "TGGL", "GWgh", "K8YI", "I9ph", "CgWt", "00Hr", "m7eD", "XT2O", "jMYy", "BNKS", "8Ecz", "VBff", "bm28", "GW7Y", "n26m", "OPVJ", "6Zmd", "O3Fn", "hvQw", "bbza", "7RU8", "pjw0", "Uwyh", "NGP5", "I4ST", "td5A", "LKAQ", "qDc0", "WOLd", "1OYs", "njkb", "7T56", "oG5Q", "6RnC", "PYy0", "Vdnv", "y9gP", "V6MF", "K2uG", "xo83", "oDeN", "HL35", "FcjN", "FEY4", "tSjS", "h2O4", "1PtV", "GoIc", "g0Kv", "Ye6F", "Sr3q", "I81D", "UIY7", "kILt", "VZMA", "0YWC", "PIOp", "MpD2", "1y34", "jjN3", "b5N8", "r4UF", "abe8", "VFIN", "GPpa", "lmwU", "cywn", "n97j", "fyPC", "XpNd", "9ncw", "Y1TX", "6lRQ", "wksx", "r80F", "bXGV", "VPgp", "HYLG", "Ho75", "sHOO", "TSAJ", "4hoK", "evli", "xroZ", "onHE", "PdcH", "7Y87", "5BJ7", "A3k6", "896X", "IARw", "I7JX", "5XLg", "2pjz", "itPz", "Y33B", "3GCG", "XPoB", "6XbT", "75QP", "qL9E", "bpuy", "SIU6", "pz0Y", "0Jjo", "WDN9", "D3HY", "Bsma", "awM0", "aeNB", "TOMn", "QYMW", "2Mno", "20At", "h1Ea", "NhZz", "M4sm", "EPUV", "LfFc", "FJLe", "CLEG", "cpWQ", "bM9c", "6S51", "FNKO", "uzeW", "sjfV", "UIXC", "M5VI", "CUc4", "S4Bw", "KX47", "8tYw", "XLPX", "R6l3", "vPOt", "hXmP", "bUOC", "TIJ5", "Sd8h", "E0H0", "RB29", "MsIH", "9w6H", "vOz7", "eIyo", "9iwR", "6lfJ", "TD32", "07bx", "nuiC", "OZpM", "NMVc", "FSA5", "0mYs", "IYNK", "5gyx", "XNVb", "zbU0", "nY0c", "NM59", "7H9O", "53PP", "2I6O", "vLxS", "awXV", "KDZ7", "FIXO", "Wn3Q", "xE73", "HwWF", "Baaq", "ZNNk", "TKL9", "O3ac", "4H8G", "s2o7", "ge5S", "YYOI", "RFCX", "cLCF", "MsKO", "HKIP", "1US4", "fivt", "8usY", "wTXs", "qkI0", "P7oh", "CDIw", "xRtL", "tEgI", "e4GJ", "LKVr", "9iGP", "kT8T", "3KZ6", "s8GI", "Vmhj", "UJRc", "81BB", "zDJo", "oGhX", "XjXp", "o4og", "ZAHC", "OF5Y", "2AXT", "dN4X", "YIxP", "WTQI", "UEIY", "JsS2", "Iwx9", "Sscz", "3Ouw", "2Mwk", "wFep", "PQ18", "O1qd", "MGCR", "Z11k", "Bmoe", "PBFW", "rFgL", "5qxb", "z2V5", "1tms", "D6MY", "1ZrF", "Y2qU", "PD5D", "33jT", "AFN8", "2BOJ", "Uopr", "F448", "1LcW", "yXKL", "jtMO", "avui", "INaf", "yGZT", "nbmK", "aL2e", "S8su", "FGmT", "rPfM", "ojrO", "UYZm", "RiR8", "NOdu", "2AMi", "ESqY", "qtdm", "TZ4s", "JDC9", "l8MB", "Q3MP", "pWVg", "aOOL", "Z8N8", "YqPW", "SzP5", "g2oB", "ZAWP", "9RIy", "hecs", "I2cg", "qjNh", "OdXJ", "EBlz", "zIez", "qo69", "Yjsu", "SW4V", "QIAK", "683T", "oguF", "gaz5", "Svgz", "OYYU", "JvE9", "I7iM", "9Rof", "jLlp", "YTPg", "9KIG", "1FlL", "pABO", "WAPk", "tjNS", "WNlo", "Oz0A", "i6fk", "G1wE", "6dFk", "1iuO", "RfUx", "Q92M", "JyYY", "GU1A", "TpdP", "FDQ3", "DLUH", "AZ9G", "2vk0", "ksoZ", "lXJA", "IZTY", "n8ab", "lXKI", "VhTx", "TvA4", "RHQU", "7VJ8", "uzUY", "XLP4", "MMOY", "Q63E", "9Mxv", "9K1H", "3f4D", "3L72", "pbzn", "RB1Q", "ciC0", "ZEF9", "PuxR", "YvYS", "3RQQ", "PRzf", "HSDu", "1PB9", "vJd9", "aSEU", "IVsp", "1Q02", "c91D", "R8Lv", "S0DF", "Jde5", "A0HL", "89HT", "zrKq", "QCPF", "J39y", "AMMF", "1UpS", "nzC8", "jg8p", "cCdR", "UJX7", "NIKN", "GQEk", "FfIO", "51YG", "eqwT", "5dyO", "a88q", "RnkR", "E66J", "1nXq", "H6MH", "ufKK", "W3On", "NsVN", "8ASK", "2IFI", "uORQ", "swrO", "OEQZ", "K4K3", "AM5S", "9NZ2", "rXfa", "ni3H", "lwsw", "UQ8X", "MOHI", "Gjtd", "yUhi", "h113", "mqaD", "YAXB", "WD0M", "JVRT", "IFRH", "vn8l", "soOR", "596U", "0jOj", "pFwk", "moXX", "Ysis", "XgFM", "JGXf", "Hu2T", "UFJv", "FuFl", "dCpn", "OC9u", "NSJj", "MVFA", "FLeg", "BvMe", "7Q2e", "xaIi", "TE1Z", "QRbl", "6jFG", "r44E", "i6DZ", "Zzv1", "Y1SW", "6Ncn", "IGgB", "hgVN", "UL48", "R4e7", "EuEp", "omFj", "6UnK", "64EX", "yUQb", "eRoT", "b52Y", "CgK8", "HdaY", "WiFB", "Gmsk", "3W9U", "xWtW", "lJ2H", "JIrR", "vmqK", "afhA", "SB6U", "73lw", "TYAl", "TJ3g", "6CQ6", "ccMz", "WQKZ", "UMfc", "KON7", "CP4y", "shpy", "pL81", "dyiH", "Jo4D", "BKey", "6lw2", "2nWC", "vH25", "VzLb", "Tf0o", "8Go8", "wMe2", "YW3K", "OAvK", "2Kep", "wANt", "hvj2", "eV59", "LO0S", "GUFc", "CHTl", "36wK", "31eV", "2LSM", "q2qK", "nmA7", "gpTL", "F467", "43Gi", "faOC", "TTQr", "CTpu", "A0AQ", "5DBN", "0ACq", "ub6f", "a3Ru", "P0TP", "EXzG", "DSWd", "yH2d", "sxCK", "ghwF", "Yeht", "S60X", "irmU", "gUIw", "ELJ4", "0vb4", "gUxf", "aaAU", "XbkX", "w956", "ulZH", "sxTR", "gi8J", "DHWY", "mlPK", "Kr8a", "A0JB", "B3HF", "7gC2", "yiXW", "myLx", "MJsx", "Goqq", "GTDh", "sVUr", "otxy", "P5r1", "FGXj", "CV6Q", "BOBB", "3dAh", "QE5e", "BQ64", "7or6", "6Mrh", "zcyn", "lTDa", "iR8L", "KwUu", "7TP7", "6MYQ", "3QLB", "zV58", "sax2", "gsgt", "RMBU", "QV9H", "HiZF", "DQkE", "DKX9", "yDhg", "rOhr", "V9hC", "85t8", "4pgg", "x3Oi", "Qc0j", "eO66", "cEpR", "9g53", "JDGt", "0ueT", "09uN", "vbwM", "aGue", "Ylnr", "WF7Q", "QNWV", "G1ur", "2cUd", "xzRX", "kKia", "dnqQ", "cBQ0", "anYU", "EWTt", "OeoK", "Flmk", "xU6a", "igvB", "d6SJ", "QZYG", "7URY", "c09x", "LZH1", "2z1u", "PD6H", "9LOm", "86IZ", "7AXr", "tnqV", "VsWT", "5FIu", "0azp", "97J6", "3dnv", "vdZ8", "G0P1", "bfmq", "Nxh4", "z2lR", "teGB", "ZzZv", "P4bO", "D16E", "rsZO", "qrVu", "mvNS", "gdaF", "ajxV", "0YgQ", "kncJ", "c1Pr", "rniN", "YT0G", "G5ES", "AD9J", "wHqz", "vHBw", "cYvG", "29ar", "mSvI", "Ow34", "M2jG", "AU7C", "AT9X", "5uOH", "U6wj", "IBZl", "DRZv", "7K9P", "73RM", "618D", "N3UJ", "rKn7", "RitS", "9tvF", "4ZkM", "sPf9", "rssn", "e8bE", "CzHo", "vtpJ", "n50G", "f90g", "Zqi2", "OAgk", "8nX2", "2NQW", "rlSS", "dJXW", "YCaP", "9DFb", "s3z0", "XyI9", "PoFi", "Mry0", "I3PC", "5OFL", "sxuF", "YIc6", "Mbyv", "1B5N", "o32A", "nVyH", "kcHo", "XoQX", "z7LM", "TFvD", "QWNA", "OrVA", "Dq10", "3fbP", "kcUf", "ZW9G", "kGaD", "9XZ9", "414C", "1T0U", "W0QC", "V47W", "TY54", "S9G5", "J3fW", "CKKH", "65wh", "3UFL", "1MHB", "j4aq", "WRBS", "8Sjv", "9jzz", "2cSQ", "aDNE", "YedG", "YOY4", "Prqk", "Oie7", "OJHs", "RfHJ", "Cgbe", "Z5vJ", "WQWQ", "PaXh", "KuTu", "zNSM", "3ZQU", "t5d5", "bq2v", "bKdj", "G6vw", "38PV", "1SUL", "kP4h", "cOdo", "QYEK", "36WP", "b3ni", "TpR8", "DN2M", "yhsH", "so6u", "kZLF", "ZExW", "ZCFC", "AOB4", "2GNN", "ycN3", "syXg", "ssYC", "luVs", "YNSE", "LQTJ", "GREF", "zbVR", "PEZZ", "PETH", "Jlu9", "Gjsh", "65SP", "xecT", "x26c", "pU0Z", "olbq", "isIv", "Qknh", "xMMB", "G4HS", "2WPQ", "tuh0", "qBsF", "o4ou", "drKN", "Xu8i", "XXFE", "RhIf", "cAMo", "NVPY", "LxmD", "LFAk", "32GT", "HYBO", "5jZ8", "d7ld", "XJLR", "wSh9", "KBdU", "DH11", "6CVF", "2zFI", "kOq9", "gz8r", "dX6u", "I6MY", "EA4F", "DEVq", "BAxi", "B0b4", "7TTK", "2esi", "xjts", "tpKv", "JAGO", "pxPV", "9D6L", "yefU", "8BXV", "7c6F", "XnUq", "XLWG", "Vdow", "THMK", "1SeK", "dXEi", "cu3i", "Va2e", "OMzu", "H2bv", "4WKG", "0ZyU", "v9Pq", "WIev", "K6IC", "Fhcx", "CX0j", "8iRX", "WwVr", "QCMV", "KyqR", "DhTL", "jvRA", "bUk8", "U98J", "Trl8", "F525", "oaWW", "cgTK", "9nhd", "9BMP", "tIKd", "sIHG", "hdnx", "MfpO", "MAN2", "FzFj", "7ZSy", "5HJQ", "4k4r", "3qdk", "1pQU", "duB1", "HLUZ", "9jRD", "twlu", "r4Da", "oPJE", "gAtV", "UYho", "IS4T", "6ida", "1BLB", "16R8", "vdeh", "hiv2", "dOC7", "M2R5", "rPNy", "qe8U", "doOR", "bzOW", "ULQJ", "NECE", "C3WB", "8Y72", "1mve", "Jeao", "JMkM", "GFRU", "4C2o", "HHkc", "CXL3", "ATtI", "9H8U", "oSZh", "arvG", "R9ie", "Jwsa", "GsHl", "CZ95", "2xnr", "2mb5", "2Xad", "ucQA", "mOWE", "gMVW", "P6GF", "HJUm", "2FGX", "1qrF", "NoVR", "NLoS", "NCPp", "KU9d", "JtHe", "vqx1", "smMo", "iqrC", "BzHt", "8CXO", "567f", "sftf", "ZNU3", "SN9V", "OPpP", "H1IW", "rGZ0", "fZDt", "2ChV", "1I41", "QHdE", "OtW2", "OeoW", "CGC1", "6O78", "3t7x", "sdSS", "aTNM", "YCQJ", "PJ1J", "ALGK", "3Uja", "vw0q", "knVD", "dcpH", "X0FP", "VIe0", "TW9Z", "NN2P", "LQCE", "GTJO", "FRC4", "7FzP", "l5Wb", "g68X", "eUXU", "XOZO", "PhfZ", "OCVs", "rzQu", "5NHF", "YonH", "PvDF", "7fi4", "6NuA", "GP2M", "G9Oi", "DC33", "82MJ", "wQOM", "tEMH", "TZV7", "EMIe", "3BpB", "xoKT", "qEPY", "mB1R", "MrFb", "CaMK", "4FF7", "vfQm", "rcoq", "qLOR", "Gfqr", "CDGK", "vFdu", "pGPr", "lq6k", "fWmR", "b6OA", "YrWt", "UAE5", "F9O9", "BYSp", "tUFs", "a07I", "XgvT", "USp2", "PT3e", "GUSN", "DXR7", "5pFZ", "rk9T", "oYG6", "npki", "mr37", "mfFJ", "dWXU", "S7PT", "NTMJ", "J8uO", "1ut4", "zQB2", "yKCd", "wKjb", "rMsa", "oeuY", "lAbS", "dn3i", "YJQF", "J3py", "GS7C", "ArDF", "zjoJ", "uBKO", "r0oB", "nA63", "lVnE", "XW8f", "HHBX", "8Lea", "29B2", "uieP", "mAY6", "ESGk", "84LE", "1hxT", "zBqT", "usEI", "p1mQ", "i8L7", "VEu6", "ScVO", "RV48", "02eW", "mk5B", "k5ID", "e9zB", "WOJF", "Nczl", "HTAX", "hyBl", "VJkD", "PJ33", "MSIX", "JkFv", "xEvu", "bJnw", "JuaU", "y80S", "sRc1", "s3Is", "ngzP", "TM9O", "N6ZZ", "4aoB", "1DvF", "mvLD", "msRL", "d5rg", "byZp", "Zw8p", "Uxoh", "UHTN", "QZAC", "QJYj", "OYN5", "HcM9", "12GP", "06Ay", "fT6r", "dhl7", "NjcD", "9p0o", "8Tuq", "619H", "06CK", "r0S4", "opYH", "MXhv", "LSE4", "IxD3", "IQ7P", "43Du", "12uu", "imx5", "dmNx", "ZVAQ", "TWNK", "Ma1P", "DM4p", "93ri", "4LXr", "3UP8", "jMy2", "eOgV", "b8aO", "Hxfc", "FyvH", "ffNq", "crsb", "rFOT", "pHTp", "Wz7q", "WIon", "KAgW", "Jaaa", "E6nZ", "CVuz", "6YLR", "vH7T", "SJD3", "EX26", "0WeZ", "vYXj", "XIz0", "RKwU", "Jqmw", "CJcg", "8juA", "8Cuz", "7zPR", "xf88", "O4GC", "F6a8", "1EQG", "qBa8", "mqMJ", "h9XS", "K3FE", "2taW", "1u45", "1HOA", "tcwL", "qq8A", "mn5Z", "Pxk6", "Os4i", "MAZT", "KgVE", "DZIm", "CyIS", "CNbh", "CKPH", "7eou", "6KwU", "3I6J", "uuoe", "LmaR", "LAfJ", "HEF3", "ClM4", "BG36", "B2aM", "AWdq", "5JfO", "gUfi", "Uk9j", "TuWk", "Lo9i", "JqA0", "5Mdp", "uHU5", "tLxi", "lZ6H", "cs8v", "Tluw", "LVTD", "KRh1", "EFZV", "5BUz", "38UI", "274J", "tkW0", "rYZ8", "mTW6", "8Fya", "5L29", "3T51", "qmAz", "Idwy", "G2RI", "EZSB", "ECM8", "DWC0", "9IOV", "8Uk1", "85rR", "71Vp", "40PG", "ykeE", "lZPd", "j3Bb", "h3Zw", "XX7d", "Wmcy", "UfoL", "PK64", "O9ON", "9eR3", "wYUo", "aq3t", "aZFX", "U8VW", "K32M", "IQfT", "qm4e", "j019", "hYZV", "Wkxk", "O2E1", "LojE", "DOFF", "7Mav", "5k9D", "nrRy", "mQWk", "m72H", "Q3I5", "KHAV", "IRub", "8LFL", "yu5A", "ju8w", "i0AW", "JxBw", "GXQ9", "2cPU", "yhlW", "pwkr", "bFfr", "WvnH", "LT78", "6DNG", "2EZB", "modX", "iIsJ", "fqM9", "cmL7", "WVI6", "UTTm", "UNoh", "Pitp", "MX1C", "MHE0", "ISSE", "Geci", "7YIg", "0tcE", "yq5w", "wdEc", "pT0d", "m30Q", "griC", "brJC", "TV6P", "3021", "hchQ", "aAp6", "N83Q", "HZNW", "Gcr8", "EIQl", "v9iy", "um0N", "LVB3", "GUqK", "CPPG", "4SIX", "we22", "qdpb", "oQD0", "m1Xp", "e3VB", "cHVb", "Vh94", "RQzT", "B5OY", "sOAz", "rpDF", "ZAL2", "M0NU", "FVVN", "it0Q", "hkja", "aOJs", "W1XI", "RLGv", "QxAV", "NKUL", "IVAZ", "HdfR", "DPTN", "6mbe", "3r6o", "3hQZ", "wUb5", "uhnn", "pB7R", "p1Io", "jVmf", "i8Qn", "hQnt", "dgHs", "cUtH", "KJYA", "HOmT", "2r2p", "0vRx", "yB5z", "vqDr", "jDKg", "f7wA", "a8Oi", "Ywfa", "Y994", "6owB", "4sIy", "2byh", "2P79", "wnzD", "idvW", "XVAD", "UGEN", "TsVQ", "RYSY", "OPGx", "Npxb", "HhJD", "HGxC", "GamS", "DLFH", "3KPQ", "wabJ", "wBfl", "kBHH", "aRFP", "XrBF", "Q0JB", "NKq0", "KaWW", "GrHY", "Edt2", "DD0I", "xlym", "uCWG", "qkmL", "keJV", "csku", "ZSsX", "XJXT", "W5iH", "HX3a", "EPE3", "EGDB", "CjLO", "5Vjd", "4RSG", "wHnE", "bBGn", "aR0u", "Z62O", "WQ4B", "2Vr8", "l5RF", "dc44", "UO1B", "Rfzg", "BEcP", "31UY", "1NEa", "pInW", "lXtq", "lMzY", "kKdN", "epP4", "XdrJ", "WA4I", "Hy5b", "6PbG", "soQQ", "r6Yl", "lRsV", "fujf", "eWnW", "ZEae", "YEMk", "XgNA", "UxV1", "QpHa", "P14D", "HOKZ", "H2RI", "E8FI", "BRXZ", "7GOB", "6Y6u", "YXKZ", "NA51", "MUMF", "L07t", "IU7R", "zxS0", "yZ1N", "u7kO", "Utdt", "UFIb", "S854", "Oh74", "NpyG", "CNUO", "BNXp", "ACBQ", "9D5C", "67eG", "5jpu", "5Wn2", "wwA6", "qNYS", "l2CW", "fyca", "YxVt", "Voz1", "LJCU", "EXRh", "8xlG", "8WMX", "8N3U", "3mJA", "2D0S", "0vkj", "UDUN", "RCox", "NRH1", "E1PQ", "8Snz", "6yJv", "2ebU", "kwAW", "gfEz", "dT9F", "XNvz", "V9QT", "MUSo", "9RYY", "5hCb", "3EJO", "227G", "Zk4o", "TVXU", "RYXJ", "F6ZT", "9TIY", "4pol", "tlk6", "UceP", "Sh8l", "IJJF", "4UWM", "3T2M", "2T68", "iIxl", "g9Ga", "WFBS", "MIR8", "8MQ9", "2qjb", "vEHt", "m3SN", "dn6E", "TKUZ", "P140", "Jggm", "HLAQ", "HC6K", "EWeO", "E3ZK", "5Lbn", "1jn9", "160J", "q7dY", "SGNk", "RTGg", "GNV3", "AfMB", "7RS8", "yksQ", "f205", "aqsG", "YtZL", "Q9Bw", "Pugs", "NEEX", "IS1h", "FE5R", "BxRG", "5kyn", "5c1V", "xbHe", "urTL", "o2FI", "lFGG", "X7uz", "WoPv", "TR2e", "O6Wr", "CFYT", "4R5T", "u81K", "phsi", "gUTp", "dP91", "coU2", "XrUF", "UNP8", "L2D7", "FnUM", "EG6A", "tlv8", "rPcA", "orgN", "m08g", "kCY1", "gQne", "erik", "aXnC", "Tr5Q", "Qu1t", "QHxZ", "Plhj", "PTOT", "N2Ot", "IP8D", "39WI", "va3d", "fFIB", "V1DQ", "Tfo0", "ITFA", "1yg2", "0Vj4", "yx4h", "sE2Y", "mzgP", "fPsQ", "Whsy", "VXLU", "RucJ", "RPR0", "D28Z", "C9lS", "BITT", "6XGS", "37QZ", "32pI", "mwlw", "k2GV", "jn96", "d7kn", "bqem", "auRo", "a3TQ", "Wymm", "PzkN", "IKYH", "HrNc", "E0QL", "7Oqq", "3YqD", "eFPf", "VCIn", "LNS5", "K615", "HVW7", "9ii9", "4B2G", "whpk", "ngBC", "ftPy", "Xj1K", "W88L", "SPQe", "PkhK", "PZB8", "FY8D", "Cwym", "BIB9", "BCVW", "30ZO", "2j18", "xfdL", "hzsT", "fMbl", "chH9", "c98Q", "bZUO", "RMBX", "OZ5W", "GwiI", "G2A7", "EII7", "E8Z2", "AZDa", "sFoR", "orom", "lQDZ", "aIPy", "a4hE", "XLBR", "SC8R", "RDQW", "0NVt", "jC1w", "hOOY", "WBP9", "UEq7", "KNAa", "DYVT", "69MK", "yjaP", "uqRU", "h50J", "fXnO", "aXeI", "V3HV", "SgJ0", "RWpX", "R1Qt", "6ow1", "657e", "5r4X", "4apU", "0Bpt", "vyIS", "vJus", "pr78", "jhBg", "fykC", "c1v7", "apm5", "anOl", "TxqU", "S9S8", "R2AF", "PQNE", "ODGj", "JpUT", "3wJO", "zXlT", "slrQ", "q2AS", "iDEm", "g8qR", "WrzZ", "VDUY", "U323", "Kvvn", "K9UG", "H9VA", "DwPj", "CHhB", "7RI6", "xGs1", "bpG1", "ZSzZ", "WNXf", "OTfG", "MJ9L", "M6qW", "KNzo", "GDV2", "GCGU", "EyMh", "9e2X", "55WR", "y0SD", "lNdz", "e4Ij", "c2rd", "YHPT", "Q6S8", "Q4SV", "Pe1h", "Bmgu", "BMKi", "7KWB", "3Jb4", "2MW8", "vSpJ", "tJbv", "lHkO", "lFDs", "fyC1", "K0ML", "JGwV", "EOOW", "EGZ6", "4WMD", "0b8y", "r1cp", "fKYC", "URUR", "UQ8G", "A05r", "8omd", "uLXS", "tXpS", "q8gQ", "gOp5", "ZOHF", "Bpuc", "8KXH", "3LkL", "1am2", "qkqu", "qSzc", "fepi", "Qr9l", "Kgmc", "GT2K", "Dg78", "9ET8", "6N4A", "5EBW", "39BF", "1jgE", "QSsh", "NEgm", "MYlE", "MBUm", "IWaY", "I5RR", "D5ST", "B4BU", "B0xH", "vTRS", "t3Oj", "jIKn", "cY5y", "U7Fl", "O9Sk", "NHgO", "LuNn", "GmK7", "G9ZQ", "DK0L", "76EF", "6qZA", "6LUC", "68x5", "1UEF", "w9lz", "tNiJ", "oqBh", "laPM", "kywY", "hNQP", "fXnB", "ZE9I", "Y1QD", "XWYA", "U18t", "SyXU", "NQ0f", "N2r1", "MUBK", "M6OI", "KMef", "JmbG", "IqZz", "EB0H", "C4ex", "AWuU", "2RQL", "wLpK", "UDVB", "N7rK", "AhTi", "3f7r", "1Mn3", "0gXI", "xbvJ", "pJXR", "jYco", "g8Hw", "V0CL", "TUy5", "L33B", "BmO1", "l0Ys", "bppZ", "aC91", "SiAx", "QN6Y", "OAML", "MSGH", "KxUH", "J4A1", "72S5", "2aJK", "vhzS", "ksLL", "felQ", "d4XH", "bv60", "Z2TX", "YN7T", "WsAc", "O9Jw", "IgN9", "GTLZ", "6OV8", "2w6N", "wWDc", "qXOI", "oQjd", "RD8T", "NPhu", "MrCh", "KVTT", "CbcD", "9lgZ", "2c4P", "sc4s", "mqqm", "cuY6", "T5dT", "HsBj", "F93G", "BpBP", "7w0Y", "7pso", "4TM0", "zfLv", "ueqw", "c5Q2", "VbNi", "VW0X", "Urm5", "R8kt", "PsiR", "NVSC", "CEJQ", "9J6d", "6zPp", "2UJD", "1D4g", "tkeW", "tMh7", "qNJf", "jgd1", "ge04", "U2qS", "F5cW", "zLqP", "lqFc", "kiHQ", "hbnK", "ZJ2V", "ZAIY", "UEsh", "PIRM", "J2M5", "DAIZ", "5PBo", "xYk5", "woSp", "wake", "pAEb", "mucB", "jQ2B", "gZCj", "bSrm", "ZmIS", "ZM6s", "DTdR", "B616", "5NPD", "4USQ", "3sDG", "2XU4", "uJ01", "tyOW", "sIuM", "i6Sx", "SVea", "S57W", "NnNd", "De2V", "8HL5", "7Qfy", "32L4", "2dzG", "xPax", "sXRY", "rVVI", "qL1y", "n20F", "Zmo1", "RJAS", "PsZ1", "LfTG", "FN1L", "AeJ9", "sp4V", "rZRv", "r30j", "i8Tt", "dQ8l", "XBXI", "W7ws", "SLBI", "QcFE", "PdwK", "PFMd", "KZG1", "HtPN", "FQWS", "AvXV", "9Xvb", "zhM4", "uNLD", "s9MF", "oFco", "lTbO", "jHHR", "gtFB", "difG", "Y1SQ", "WWEM", "KW7Y", "IGG7", "C30G", "x94A", "whlF", "p4tq", "jVgu", "eSNJ", "XUOS", "Wz99", "WWmj", "SVXG", "On7G", "IeAX", "FLvL", "6UTC", "5ITL", "3k4G", "2JK7", "1MXn", "uqfD", "moqF", "j9m8", "iy61", "hsYX", "cT43", "Z7LC", "SSI5", "SAOG", "N4uz", "MO4V", "KKBG", "K5In", "BVru", "8NQH", "79OF", "yrdg", "j77Z", "iEnK", "dlSj", "Ufsw", "UVKA", "RLd5", "QLwE", "M8DI", "KhnO", "0N1D", "vP6o", "qeFc", "nPR9", "j0tv", "d61Q", "cvRC", "Tlmk", "OFqt", "NXEO", "LVth", "JYII", "Ektc", "DH9u", "A4Sg", "7Z2N", "3zuz"]
//     var dest = [Math.floor(Math.random() * dist_id_choices.length)];
//     return dest;
// }

export function setup() {
  // register a new user and authenticate via a JWT token.
  const res = http.post(`${BASE_URL}/auth/users/`, {
    first_name: 'Johnny',
    last_name: 'Depp',
    email: USERNAME,
    password: PASSWORD,
    re_password: PASSWORD,
  });

  check(res, { 'created user': (res) => res.status === 201 });

  const loginRes = http.post(`${BASE_URL}/auth/jwt/create/`, {
    email: USERNAME,
    password: PASSWORD,
  });

  const authToken = loginRes.json('access');
  check(authToken, { 'logged in successfully': () => authToken !== '' });

  return authToken;
}

export default (authToken) => {
  const requestConfigWithTag = () => ({
    headers: {
      "Authorization": `JWT ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  group('Public endpoints', () => {

    const responses = http.batch([
      ['GET', `${BASE_URL}/loadtest/`, null],
    ]);

    const statuses = Object.values(responses).map((res) => res.status === 200);

    // Functional test: check that all values in statuses are true
    check(statuses, {
      'Endpoints returned successfully': allAreTrue(statuses),
    });
    sleep(5)
  });

  group('Create and modify booking', () => {
    let url = `${BASE_URL}/booking/`;

    const dest_id = "Sr3q";
    const rooms = 1;
    const num_guests = 2;
    const start_date_str = "2022-08-04";
    const end_date_str = "2022-08-08";
    const guests_query = Array(rooms).fill(num_guests).join('|')

    const searchParams = new URLSearchParams([
      ['destination_id', dest_id],
      ['checkin', start_date_str],
      ['checkout', end_date_str],
      ['lang', 'en_US'],
      ['currency', 'SGD'],
      ['country_code', 'SG'],
      ['partner_id', '16'],
      ['guests', guests_query],
    ]);


    const proxy_response_rooms = http.get(`${BASE_URL}/proxy/hotels/zqBa/price?${searchParams.toString()}`).json("proxy_json");
    check(proxy_response_rooms, { 'rooms returned': (proxy_response_rooms) => proxy_response_rooms !== null });
    check(proxy_response_rooms, { 'Price response received': (proxy_response_rooms) => proxy_response_rooms.status === 200 })
    let price = null;
    for (let room of proxy_response_rooms.rooms){
      if (room !== null){
        price = room.price;
        break;
      }
    }
    check(price, { 'Price found': (price) => price !== null });
    sleep(3);
    
    group('Create Booking', () => {
      const payload = {
        "destination_id": dest_id,
        "hotel_id": "zqBa",
        "room_type_id": "314254542",
        "room_breakfast_info": "b_info",
        "destination_region": "DEST_REGION",
        "hotel_name": "h_name",
        "room_type": "room_type",
        "booking_id": "b_id", //generated_in_backend
        "check_in_date": "2022-08-30",
        "check_out_date": "2022-09-03",
        "cost_in_sgd": price, //will be recalculated_in_backend
        "number_of_rooms": "1",
        "number_of_guests_per_rooms": "2",
        "special_request": "nahh",
        "primary_guest_title": "MR",
        "primary_guest_first_name": "Johnny",
        "primary_guest_last_name": "Depp",
        "primary_guest_email": "Johnny_Depp@gmail.com",
        "primary_guest_phone": "95634586",
        "primary_guest_phone_country": "Singapore",
        "did_primary_guest_accept_tnc": true,
        "name_on_card": "Johnny Depp",
        "card_number": "4263982640269299",
        "billing_address_address": "235 Sixth Avenue Very Rich Building",
        "billing_address_country": "Singapore",
        "billing_address_city": "Singapore",
        "billing_address_post_code": "024543",
        "security_code": "593",
        "expiry_date": "2024-01-01"
      };

      const res = http.post(url, payload, requestConfigWithTag());
      if (check(res, { 'Booking created correctly': (r) => r.status === 201 })) {
        console.log("Booking Created")
      } else {
        console.log(`Unable to create a Booking ${res.status} ${res.body}`);
        return;
      }
    });

    // group('Update Booking', () => {
    //   const pk = booking_id
    //   url = `${BASE_URL}/booking/${pk}/`;
    //   const payload = { number_of_rooms: "4" };
    //   const res = http.put(url, payload, requestConfigWithTag());
    //   const isSuccessfulUpdate = check(res, {
    //     'Update worked': () => res.status === 202,
    //     'Updated room is correct': () => res.json('number_of_rooms') === '4',
    //   });

    //   if (!isSuccessfulUpdate) {
    //     console.log(`Unable to update the booking ${res.status} ${res.body}`);
    //     return;
    //   }
    // });
  });

  sleep(2);
};

export function teardown(PASSWORD) {
  const current_pw = {
    current_password: PASSWORD,
  }
  const delete_user_endpoint = `${BASE_URL}/auth/users/me/`;
  const delRes = http.del(delete_user_endpoint, current_pw, requestConfigWithTag());

  const isSuccessfulDelete = check(delRes, {
    'User was deleted correctly': () => delRes.status === 204,
  });

  if (!isSuccessfulDelete) {
    console.log(`Booking was not deleted properly`);
    return;
  }
}