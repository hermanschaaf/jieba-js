require(["data/dict"], function(dict) {


    var cut = function(sentence){
        var cut_all = false,
            HMM = true;

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
                    console.log(word); // TODO yield
                }
            }
            else {
                var tmp = blk.split(re_skip);
                for (var i = 0; i < tmp.length; i++) {
                    var x = tmp[i];
                    if (x.match(re_skip)) {
                        console.log(x); // TODO yield
                    }
                    else if (!cut_all) {
                        for (xx in x) {
                            console.log(xx); // TODO yield
                        }
                    }
                    else {
                        console.log(x); // TODO yield
                    }
                }
            }
        }
    }


});