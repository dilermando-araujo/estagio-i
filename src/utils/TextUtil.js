export default class TextUtil {
    static getTextWithBreakLines(text, maxPerLine) {
        const words = text.split(' ');
        const sentences = [];

        let sentence = '';
        for (let i in words) {
            if (sentence.length + words[i].length < 25) {
                sentence += ' ' + words[i];
            } else {
                sentences.push(sentence);
                sentence = words[i];
            }
        }

        if (sentence != '') sentences.push(sentence);

        return sentences.join('\n');
    }
}