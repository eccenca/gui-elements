import "regenerator-runtime/runtime";

if (window.document) {
    window.document.body.createTextRange = function() {
        return {
            setEnd: function(){},
            setStart: function(){},
            getBoundingClientRect: function(){
                return {right: 0};
            },
            getClientRects: function(){
                return {
                    length: 0,
                    left: 0,
                    right: 0
                }
            }
        }
    }
}

