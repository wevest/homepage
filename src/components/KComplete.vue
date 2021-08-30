<template>
    <div class="kr-auto-complete">
        <input type="text"
            :value="input"
            :class="inputClass"
            :onMessage="onMessage"

            @input="onInput"
            @keydown.up.prevent="cursorUp"
            @keydown.down.prevent="cursorDown"
            @keydown.enter="cursorSelect"
            @keydown="onKeyDown"            
            @blur="blur"
            @focus="focus"

            :autofocus="autoFocus">
            
        <div class="matches-box" v-if="matches">
            <template v-if="matches.length === 0">
                <slot name="no-matches">
                    Could not find any matches
                </slot>
            </template>
            <template v-else>
                <ul :class="ulClass">
                    <li v-for="(match, idx) in matches" :key="idx" :class="[liClass, cursorOffset === idx ? activeClass : '']">{{match}}</li>
                </ul>
            </template>
        </div>
    </div>
</template>

<script>
const hangul = require('hangul-js');
import CommonFunc from 'src/util/CommonFunc';
import LocalStorageService from 'src/services/localStorage';


export default {
  name: 'kcomplete',
  data () {
        return {
            input: null,
            data: null,
            debounceTimer: null,
            matches: null,
            cursorOffset: null,
            lastInputValue: null,

            g_message: null
        }
  },
  props: {
    debounceTime: {
      type: Number,
      default: 50
    },
    inputClass: {
      type: String,
      required: false,
      default: ''
    },
    ulClass: {
      type: String,
      required: false,
      default: ''
    },
    liClass: {
      type: String,
      required: false,
      default: ''
    },
    activeClass: {
      type: String,
      required: false,
      default: 'cursor'
    },
    autoFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    onMessage: {
      type: Function,
      required: true,
      default: ''
    }
  },
  beforeMount () {
    //console.log("Kcomplete.beforeMount");

    this.$emit('load', {
        setter: data => {
            if (!(data instanceof Array)) {
                console.error('@load 이벤트의 setter 넘기는 인자는 array of string 이어야 합니다.')
                return
            }
            this.data = data.map(word => {
                return {
                    original: word,
                    disassembled: hangul.disassemble(word).join('').toLowerCase()
                    }
                })
            }
        })
    },
    methods: {
        setCompleteData() {
            let _this = this;
            
            
            let codes = LocalStorageService.getCode();
            logger.log.debug('codes=',codes);
            let data = [];
            for (var a_item in codes) {
                //console.log('a_item=',a_item);    
                data.push( codes[a_item].name + "  (" + a_item + ")");
            }
            //console.log("data=",data);
            this.setData(data);
        },

        setData(data) {
            this.data = data.map(word => {
                return {
                    original: word,
                    disassembled: hangul.disassemble(word).join('').toLowerCase()
                }
            })
        },

        onInput (e) {
            if (! this.data) {
                this.setCompleteData();
            }

            if (e.target.value === this.lastInputValue) {
                return
            }
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
            }
            this.input = e.target.value
            this.debounceTimer = setTimeout(() => {
                this.search(this.input)
                this.debounceTimer = null
                this.lastInputValue = e.target.value
            }, this.debounceTime)
        },
        search (input) {
            if (input === null || input.length === 0) {
                this.matches = []
                return
            }
            this.matches = this.findMatches(input);
            this.initCursor();
        },
        findMatches (input) {
            const disassembledInput = hangul.disassemble(input).join('').toLowerCase();
            let matches = [];
            if (this.data === null) {
                console.warn('data is not set. make sure you implemented function for @load')
                return []
            }
            this.data.forEach(({original, disassembled}) => {
                if (disassembled.indexOf(disassembledInput) > -1) {
                    matches.push(original)
                }
            })
            return matches;
        },
        /**
         * Init cursor offset
         */
        initCursor () {
            this.cursorOffset = -1;
        },


        onKeyDown(e) {
            //console.log("KComplete.onKeyDown");
            //this.onKeyProc(e);
        },

        /**
         * Handle arrow up
         * @param e
         */
        cursorUp (e) {
            e.preventDefault()
            if (this.cursorOffset > -1) {
                this.cursorOffset--;
            }
        },
        /**
        * Handle arrow down
        * @param e
        */
        cursorDown (e) {
            e.preventDefault();
            if (this.cursorOffset < this.matches.length) {
                this.cursorOffset++;
            }
        },
        /**
        * Handle enter
        */
        cursorSelect () {
            if (this.cursorOffset < 0) {
                return
            }            
            this.input = this.matches[this.cursorOffset];
            this.initCursor();
            this.resetMatches();

            //console.log('cursorSelect = ',this.input, this.onMessage);

            this.onMessage('Kcomplete',this.input);

        },
        resetMatches () {
            this.matches = null;
        },
        blur (e) {
            this.$emit('blur', e);
        },
        focus (e) {
            this.$emit('focus', e);
        }
    }
}
</script>

<style lang="scss" scoped>
.kr-auto-complete {
    width: 100%;
    padding-right: 10px;
    .matches-box {
        ul {
            list-style-type: none;
            padding: 0;
            li.cursor {
                background-color:#ddd;
            }
        }
    }
    input {
        width: 100%;
    }
}

.list-group {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
}

.list-group-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #3f6ad8;
    border-color: #007bff;
}

</style>
