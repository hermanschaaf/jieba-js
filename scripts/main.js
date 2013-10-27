require(["finalseg", "data/dict"], function(dict) {
    FREQ = {}

    var max_of_array = Math.max.apply(Math, array);

    var get_DAG = function(sentence) {
        var N = sentence.length,
            i = 0,
            j = 0,
            p = trie,
            DAG = {};

        while (i < N) {
            var c = sentence[j];
            if (c in p) {
                p = p[c];
                if ('' in p) {
                    if (!(i in DAG)){
                        DAG[i] = [];
                    }
                    DAG[i].push(j);
                }
                j += 1;
                if (j >= N) {
                    i += 1;
                    j = i;
                    p = trie;
                }
            }
            else {
                p = trie;
                i += 1;
                j = i;
            }
        }
        for (i = 0; i < sentence.length; i++) {
            if (!(i in DAG)) {
                DAG[i] = [i];
            }
        }
        return DAG;
    }

    var calc = function( sentence, DAG, idx, route ) {
        var N = sentence.length;
        route[N] = [0.0, ''];
        for (idx = N - 1; idx > -1; idx--) {
            candidates = [];
            candidates_x = [];
            for (x in DAG[idx]) {
                var f = (sentence[idx:x+1] in FREQ) ? FREQ[sentence[idx:x+1]] : min_freq;
                candidates.push(f + route[x+1][0]);
                candidates_x.push(x);
            }
            var m = max_of_array(candidates);
            route[idx] = [m, candidates_x[candidates.indexOf(m)]];
        }
    }

    var __cut_DAG = function(sentence) {
        var DAG = get_DAG(sentence);
        var route = {};
        var yieldValues = [];

        calc(sentence, DAG, 0, route);

        var x = 0,
            buf = '',
            N = sentence.length;

        while(x < N) {
            var y = route[x][1]+1,
                l_word = sentence.substring(x, y);
            if (y - x == 1) {
                buf += l_word;
            }
            else {
                if (buf.length > 0) {
                    if (buf.length == 1) {
                        yieldValues.push(buf);
                    }
                    else {
                        if (!(buf in FREQ)) {
                            var recognized = finalseg.cut(buf);
                            for (t in recognized) {
                                yieldValues.push(t);
                            }
                        }
                        else {
                            for (elem in buf) {
                                yieldValues.push(elem);
                            }
                        }
                        buf = "";
                    }
                }
                yieldValues.push(l_word);
            }
            x = y;
        }

        if (buf.length > 0) {
            if (buf.length == 1) {
                yieldValues.push(buf);
            }
            else {
                if (!(buf in FREQ)) {
                    var recognized = finalseg.cut(buf);
                    for (t in recognized) {
                        yieldValues.push(t);
                    }
                }
                else {
                    for (elem in buf) {
                        yieldValues.push(elem);
                    }
                }
            }
        }
        return yieldValues;
    }

    var cut = function(sentence){
        var cut_all = false,
            HMM = true,
            yieldValues = [];

        var re_han = /([\u4E00-\u9FA5a-zA-Z0-9+#&\._]+)/,
            re_skip = /(\r\n|\s)/;

        var blocks = sentence.split(re_han);
        var cut_block = __cut_DAG;

        for (blk in blocks) {
            if (blk.length == 0) {
                continue;
            }

            if (blk.match(re_han)) {
                for (word in cut_block(blk)) {
                    yieldValues.push(word);
                }
            }
            else {
                var tmp = blk.split(re_skip);
                for (var i = 0; i < tmp.length; i++) {
                    var x = tmp[i];
                    if (x.match(re_skip)) {
                        yieldValues.push(x);
                    }
                    else if (!cut_all) {
                        for (xx in x) {
                            yieldValues.push(xx);
                        }
                    }
                    else {
                        yieldValues.push(x);
                    }
                }
            }
        }
        return yieldValues;
    }


});