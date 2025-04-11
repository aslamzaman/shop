
/**
 * Create title case
 * @param {string} str 
 * @returns 
 */
export const titleCase = (str) => {
    return str.split(" ")
        .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
        .join(" ");
}



/**
 * Create title camel case
 * @param {string} str
 * @returns
 */
export const titleCamelCase = (str) => {
    return str.split(" ")
        .map(item => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ");
}




/**
 * Inword unicode
 * @param {Number} number - Integer or Float
 * @returns 
 */
export const inwordUnicode = (number) => {
    try {
        const num = Math.round(number);
        const num_to_bd = [
            'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
            'দশ', 'এগার', 'বার', 'তের', 'চৌদ্দ', 'পনের', 'ষোল', 'সতের', 'আঠার', 'ঊনিশ',
            'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আঠাশ',
            'ঊনত্রিশ', 'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ',
            'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ',
            'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
            'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন',
            'ঊনষাট', 'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি',
            'আটষট্টি', 'ঊনসত্তর', 'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর',
            'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি',
            'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই',
            'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
        ];
        /* ----------------- Initial validation chek   ---------------- */
        if (num.toString().length > 9) {
            return "৯ ডিজিটের মধ্যে রাখুন";
        }

        if (num === 0) {
            return num_to_bd[0];
        }
        if (!num) {
            return "সংখ্যা ঠিক নাই";
        }
        /* ----------------- /Initial validation chek   ---------------- */

        const nineDigit = ("0000000000" + num).slice(-9);
        //console.log(nineDigit);

        let str = '';
        //------------------------------------
        const segments = [
            { value: nineDigit.substring(0, 2), suffix: ' কোটি ' },
            { value: nineDigit.substring(2, 4), suffix: ' লক্ষ ' },
            { value: nineDigit.substring(4, 6), suffix: ' হাজার ' },
            { value: nineDigit.substring(6, 7), suffix: 'শত ' },
            { value: nineDigit.substring(7, 9), suffix: ' ' }
        ]

        segments.forEach(segment => {
            if (parseInt(segment.value) !== 0) {
                str += `${num_to_bd[parseInt(segment.value)]}${segment.suffix}`;
            }
        })
        return str.trim();
    } catch (err) {
        return 'bv¤^vi wVK bvB';
    }
};



/**
 * Inword Bangla SutonnyMJ
 * @param {Number} number - Integer or Float
 * @returns 
 */
export const inwordBangla = (number) => {
    try {
        const num = Math.round(number);
        const num_to_bd = [
            'k~b¨', 'GK', '`yB', 'wZb', 'Pvi', 'cvuP', 'Qq', 'mvZ', 'AvU', 'bq',
            '`k', 'GMvi', 'evi', '†Zi', '†PŠÏ', 'c‡bi', '†lvj', 'm‡Zi', 'AvVvi', 'Ewbk',
            'wek', 'GKyk', 'evBk', '†ZBk', 'PweŸk', 'cuwPk', 'QvweŸk', 'mvZvk', 'AvVvk',
            'EbwÎk', 'wÎk', 'GKwÎk', 'ewÎk', '†ZwÎk', '†PŠwÎk', 'cuh়wÎk', 'QwÎk',
            'mvuBwÎk', 'AvUwÎk', 'EbPwjøk', 'Pwjøk', 'GKPwjøk', 'weqvwjøk', '†ZZvwjøk',
            'Pyqvwjøk', 'cuqZvwjøk', '†QPwjøk', 'mvZPwjøk', 'AvUPwjøk', 'EbcÂvk', 'cÂvk',
            'GKvbœ', 'evqvbœ', 'wZàvbœ', 'Pyqvbœ', 'cÂvbœ', 'Qvàvbœ', 'mvZvbœ', 'AvUvbœ',
            'EblvU', 'lvU', 'GKlwÆ', 'evlwÆ', '†ZlwÆ', '†PŠlwÆ', 'cuqlwÆ', '†QlwÆ', 'mvZlwÆ',
            'AvUlwÆ', 'EbmËi', 'mËi', 'GKvËi', 'evnvËi', 'wZqvËi', 'PyqvËi', 'cuPvËi', 'wQqvËi',
            'mvZvËi', 'AvUvËi', 'EbAvwk', 'Avwk', 'GKvwk', 'weivwk', 'wZivwk', 'Pyivwk', 'cuPvwk',
            'wQqvwk', 'mvZvwk', 'AvUvwk', 'EbbeŸB', 'beŸB', 'GKvbeŸB', 'weivbeŸB', 'wZivbeŸB',
            'PyivbeŸB', 'cuPvbeŸB', 'wQqvbeŸB', 'mvZvbeŸB', 'AvUvbeŸB', 'wbivbeŸB'
        ];
        /* ----------------- Initial validation chek   ---------------- */
        if (num.toString().length > 9) {
            return "9 wWwR‡Ui g‡a¨ ivLyb";
        }

        if (num === 0) {
            return num_to_bd[0];
        }
        if (!num) {
            return "msL¨v wVK bvB";
        }
        /* ----------------- /Initial validation chek   ---------------- */

        const nineDigit = ("0000000000" + num).slice(-9);
        //console.log(nineDigit);

        let str = '';
        //------------------------------------
        const segments = [
            { value: nineDigit.substring(0, 2), suffix: ' †KvwU ' },
            { value: nineDigit.substring(2, 4), suffix: ' j¶ ' },
            { value: nineDigit.substring(4, 6), suffix: ' nvRvi ' },
            { value: nineDigit.substring(6, 7), suffix: 'kZ ' },
            { value: nineDigit.substring(7, 9), suffix: ' ' }
        ]

        segments.forEach(segment => {
            if (parseInt(segment.value) !== 0) {
                str += `${num_to_bd[parseInt(segment.value)]}${segment.suffix}`;
            }
        })
        return str.trim();
    } catch (err) {
        return 'bv¤^vi wVK bvB';
    }
};



/**
 * Inword English
 * @param {Number} number - Integer or Float
 * @returns 
 */
export const inwordEnglish = (number) => {
    try {
        const num = Math.round(number);
        let a = [
            "",
            "one ",
            "two ",
            "three ",
            "four ",
            "five ",
            "six ",
            "seven ",
            "eight ",
            "nine ",
            "ten ",
            "eleven ",
            "twelve ",
            "thirteen ",
            "fourteen ",
            "fifteen ",
            "sixteen ",
            "seventeen ",
            "eighteen ",
            "nineteen ",
        ];
        let b = [
            "",
            "",
            "twenty",
            "thirty",
            "forty",
            "fifty",
            "sixty",
            "seventy",
            "eighty",
            "ninety",
        ];
        /* ----------------- Initial validation chek   ---------------- */
        if (num.toString().length > 9) {
            return "Over the nine digit";
        }

        if (num === 0) {
            return a[0];
        }

        if (!num) {
            return "No data!";
        }
        /* ----------------- /Initial validation chek   ---------------- */

        const nineDigit = ("0000000000" + num).slice(-9);
        console.log(nineDigit);


        // 58,96,41,357
        let str = '';
        //------------------------------------

        const fn = (n) => {
            const num = parseInt(n);
            if (num < 20) {
                return a[num];
            } else {
                const tens = Math.floor(num / 10);
                const ones = num % 10;
                return b[tens] + ' ' + a[ones];
            }
        }

        const segments = [
            { value: nineDigit.substring(0, 2), suffix: 'crore ' },
            { value: nineDigit.substring(2, 4), suffix: 'lac ' },
            { value: nineDigit.substring(4, 6), suffix: 'thousand ' },
            { value: nineDigit.substring(6, 7), suffix: 'hundred ' },
            { value: nineDigit.substring(7, 9), suffix: ' ' }
        ]

        segments.forEach(segment => {
            if (parseInt(segment.value) !== 0) {
                str += `${fn(parseInt(segment.value))}${segment.suffix}`;
            }
        })

        return str.trim();
    } catch (err) {
        return 'bv¤^vi wVK bvB';
    }
};




/**
 * formated date for input
 * @param {Date} dt  - Date-"yyyy-mm-dd"
 * @returns 
 */
export const formatedDate = (dt) => {
    const timestamp = Date.parse(dt);
    const initialDate = !isNaN(timestamp);
    const days = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];
    const newDate = new Date(dt);
    const fullYear = newDate.getFullYear();
    const monthIndex = newDate.getMonth();
    const date = newDate.getDate();
    return initialDate ? `${fullYear}-${days[monthIndex + 1]}-${days[date]}` : '1970-01-01';
}


/**
 * Formated date with slash -> 31/10/2024
 * @param {Date} dt - Date-"yyyy-mm-dd"
 * @returns
 */
export const formatedDateSlash = (dt) => {
    const timestamp = Date.parse(dt);
    const initialDate = !isNaN(timestamp);
    const days = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];
    const newDate = new Date(dt);
    const fullYear = newDate.getFullYear();
    const monthIndex = newDate.getMonth();
    const date = newDate.getDate();
    return initialDate ? `${days[date]}/${days[monthIndex + 1]}/${fullYear}` : '1/1/1970';
}




/**
 * Formated date with dot -> 31.10.2024 or 31.10.24
 * @param {Date} dt  - Date-"yyyy-mm-dd"
 * @param {Boolean} isFullYear  - True Or False
 * @returns
 */
export const formatedDateDot = (dt, isFullYear) => {
    const days = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];
    const newDate = new Date(dt);
    const fullYear = newDate.getFullYear();
    const monthIndex = newDate.getMonth();
    const date = newDate.getDate();
    const shortYear = fullYear.toString().substring(2, 4);
    const shortDate = `${days[date]}.${days[monthIndex + 1]}.${shortYear}`;
    const fullDate = `${days[date]}.${days[monthIndex + 1]}.${fullYear}`;
    const retDt = isFullYear ? fullDate : shortDate;
    return retDt;
}


/**
 * Formated date English -> 31 January 2024
 * @param {Date} dt  - Date-"yyyy-mm-dd"
 * @returns 
 */
export const formatedDateEnglish = (dt) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];

    const fullYear = new Date(dt).getFullYear();
    const monthIndex = new Date(dt).getMonth();
    const date = new Date(dt).getDate();
    return `${months[monthIndex]} ${days[date]}, ${fullYear}`;
}



/**
 * Formated date SutonnyMJ -> ৩১ ফেব্রুয়ারী ২০২৪
 * @param {Date} dt  - Date-"yyyy-mm-dd"
 * @returns 
 */
export const formatedDateBangla = (dt) => {
    const months = ["Rvbyqvix", "†deªæqvix", "gvP©", "GwcÖj", "†g", "Ryb", "RyjvB", "AvMó", "†m‡Þ¤^i", "A‡±vei", "b‡f¤^i", "wW‡m¤^i"];
    const days = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];

    const fullYear = new Date(dt).getFullYear();
    const monthIndex = new Date(dt).getMonth();
    const date = new Date(dt).getDate();
    return `${days[date]} ${months[monthIndex]} ${fullYear} `;
}


/**
 * Formated date Unicode -> ৩১ ফেব্রুয়ারী ২০২৪
 * @param {Date} dt  - Date-"yyyy-mm-dd"
 * @returns 
 */
export const formatedDateUnicode = (dt) => {
    const months = ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগষ্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const days = [
        "০০", "০১", "০২", "০৩", "০৪", "০৫", "০৬", "০৭", "০৮", "০৯", "১০", "১১", "১২", "১৩", "১৪", "১৫", "১৬", "১৭", "১৮", "১৯", "২০", "২১", "২২", "২৩", "২৪", "২৫", "২৬", "২৭", "২৮", "২৯", "৩০", "৩১"
    ];
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

    const newDate = new Date(dt);

    const fullYear = newDate.getFullYear().toString();
    const monthIndex = newDate.getMonth();
    const date = newDate.getDate();

    const fullYearUnicode = fullYear.replace(/\d/g, digit => bengaliDigits[digit]);

    const str = `${days[date]} ${months[monthIndex]} ${fullYearUnicode}`;
    return str;
}



/**
 * Date difference in days
 * @param {Date} dt1  - Small date-"yyyy-mm-dd"
 * @param {Date} dt2  - Bigger date-"yyyy-mm-dd"
 * @param {Boolean} isLastDate - True/false
 * @returns 
 */
export const dateDifferenceInDays = (dt1, dt2, isLastDate) => {
    const daysDifferance = Math.round((Date.parse(dt2) - Date.parse(dt1)) / 86400000);
    return isLastDate ? daysDifferance + 1 : daysDifferance;
}


/**
 * Days add in date -> 2024-10-15 + 10 -> 2024-10-25
 * @param {Date} dt1  - Date-"yyyy-mm-dd"
 * @param {Number} days  - Number any
 * @returns 
 */
export const dateAdd = (dt1, days) => {
    const resultDate = Date.parse(dt1) + (parseFloat(days) * 86400000);
    return new Date(resultDate);
}



/**
 * Date difference local
 * @param {Date} dt1  - Small date-"yyyy-mm-dd"
 * @param {Date} dt2  - Bigger date-"yyyy-mm-dd"
 * @returns 
 */
export const dateDifferenceLocal = (dt1, dt2) => {
    let extraMonth = 0;
    let extraYear = 0;
    let years = 0;
    let months = 0;
    let days = 0;

    let year1 = new Date(dt1).getFullYear();
    let month1 = new Date(dt1).getMonth();
    let date1 = new Date(dt1).getDate();

    let year2 = new Date(dt2).getFullYear();
    let month2 = new Date(dt2).getMonth();
    let date2 = new Date(dt2).getDate();

    if (date2 < date1) {
        days = ((30 + date2) - date1);
        extraMonth = 1;
    } else {
        days = (date2 - date1);
        extraMonth = 0;
    }

    if (month2 < (month1 + extraMonth)) {
        months = ((12 + month2) - (extraMonth + month1));
        extraYear = 1;
    } else {
        months = (month2 - (extraMonth + month1));
        extraYear = 0;
    }

    years = year2 - (extraYear + year1);
    return { years, months, days }
}



/**
 * Is date -> true/false
 * @param {Date} dt - Date-"yyyy-mm-dd"
 * @returns 
 */
export const isDate = (dt) => {
    const timestamp = Date.parse(dt);
    return isNaN(timestamp) ? false : true;
}



/**
 * last days in number -> December 2024 -> 31days
 * @param {Number} yyyy - Full years
 * @param {Number} m - Month
 * @returns 
 */
export const lastDayInMonth = (yyyy, m) => {
    // example (2021, 0) = 31 ; (2021, 1) = 28;
    let dt = new Date(yyyy, (parseInt(m) + 1), 0);
    return dt.getDate();
};



/**
 * Number with comma -> Indian
 * @param {Number} num - Integer of float
 * @param {Boolean} isDecimalPart - True or False
 * @returns 
 */
export const numberWithComma = (num, isDecimalPart) => {
    let st = '';
    if (isDecimalPart) {
        let [integerPart, decimalPart] = parseFloat(num).toFixed(2).split('.');
        const formattedInteger = parseInt(integerPart).toLocaleString('en-IN');
        st = `${formattedInteger}.${decimalPart}`;
    } else {
        let roundNumber = Math.round(num);
        const formattedNumber = roundNumber.toLocaleString('en-IN');
        st = `${formattedNumber}`;
    }
    return st;
};



/**
 * Number with comma -> ISO
 * @param {Number} num - Integer of float
 * @returns 
 */
export const numberWithCommaISO = (num) => {
    const fixedNum = parseFloat(num).toFixed(2);
    return fixedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


/**
 * Create a style sheet on html head tag for print page
 * @param {String} portrait - If page portrait then 'p' else 'l'
 * @param {Number} top  - Top margin in inch
 * @param {Number} right  - Right margin in inch
 * @param {Number} bottom  - Bottom margin in inch
 * @param {Number} left  - Left margin in inch
 */
export const printPageSetup = (portrait, top, right, bottom, left) => {
    let styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
   @media print {
        @page {
            size: A4 ${portrait === 'p' ? 'portrait' : 'landscape'};
            margin-top: ${top}in;
            margin-right: ${right}in;
            margin-bottom: ${bottom}in;
            margin-left: ${left}in;
        }
    }
    `;
    document.head.appendChild(styleElement);
}



/**
 * Convert digit to unicode from string
 * @param {any} number - Number or String 
 * @returns 
 */
export const convertDigitToUnicode = (number) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().replace(/\d/g, digit => bengaliDigits[digit]);
}


/**
 * Sort array function
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
export const sortArray = (a, b) => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}



export const customIdForFirebase = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customId = '';
    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        customId += chars[randomIndex];
    }
    return customId;
}





export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const unique = (data) => [...new Set(data)];


export const convertCsvToJson = (csv, headerArray) => {
    const lines = csv.split("\n"); // Trim and split into rows
    const dataRows = lines.slice(1);  // Deduct first row
    return dataRows.map(item => {
        const values = item.split(";").map(value => value.trim());
        let result = {};
        for (let i = 0; i < headerArray.length; i++) {
            result = { ...result, [headerArray[i]]: values[i] }
        }
        return result;
    })
}

