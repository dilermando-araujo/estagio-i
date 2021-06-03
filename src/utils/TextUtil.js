export default class TextUtil {
    static getTextWithBreakLines(text, maxPerLine = 25, endSentence = '|') {
        const words = text.split(' ');
        const sentences = [];

        let sentence = '';
        for (let i in words) {
            if (sentence.length + words[i].length < maxPerLine && 
                !(words[i].charAt(0) === endSentence) && 
                !this._previusIsBreakLine(words, i)
            ) {
                sentence += ' ' + words[i];
            } else {
                console.log(sentence);
                sentences.push(sentence);
                sentence = words[i];
            }
        }

        if (sentence != '') sentences.push(sentence);

        return sentences.join('\n');
    }

    static _previusIsBreakLine(words, i) {
        if (i === 0)
            return false;

        if (words[i - 1] === '\n')
            return true;
        
        return false;
    }
}