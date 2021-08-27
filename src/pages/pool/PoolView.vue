<template>
    
    <div class="q-pa-md">

        <CTitle ttype='title' 
            :title="$t('page.bookmark.title')" :desc="$t('page.bookmark.desc')" 
            extraCaption="Add" @onClickTitleExtra="onClickAdd" />

    </div>    

</template>


<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';


export default {
    name: 'PoolView',
    components: {
        CTitle,
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
                delayOnTouchOnly: true,
                delay:200, 
            }
        },
        v_is_owner() {
            return true;
        }        
    },
    data() {
        return {          
            v_enabled:true,  
            v_drag:false,
            //v_bookmarks: new BookmarkListModel(),
            //id: 1,label: 'Satisfied customers',children: [],
            //v_data: [],

            v_data: [],
        }
    },
    created() {
        //console.log("HomeView.created");
        logger.log.debug("BlogView.created - query=",this.$route.query);

        //this.validateQuery();
    },
    mounted() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        //this.refresh();
    },
    beforeDestroy() {
        logger.log.debug("BookmarkView.beforeDestroy");
        //this.onClickSave();
    },
    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.category)) {
                return;
            }

            NavFunc.navError404(this);
        },        
        refresh() {
            this.loadBookmarks();
        },

        getBookmarkDicdata() {
            let dicData = [];
            for (let index=0;index<this.v_data[0].items.length++;index++) {
                dicData.push( {} );
            }
            return dicData;            
        },
        loadBookmarks() {
            //const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
            logger.log.debug('BookmarkView.loadBookmarks');
            const _this=this;
            
            this.v_me.bookmarks.clear();            
            this.v_me.loadBookmarks().then(resp=>{
                logger.log.debug('BookmarkView.loadBookmarks : items=',_this.v_me.bookmarks.items);
                _this.v_data = _this.v_me.bookmarks.items;
                //_this.assignData(_this.v_me.bookmarks.items);
            }).catch(err=>{
                logger.log.error('BookmarkView.loadBookmarks : err=',err);
            });
        },

        checkMove(e) {
            logger.log.debug("Future index: " + e.draggedContext.futureIndex);
        },
/*
        added(event, group) {
            const newItems = this.v_rows
                .map(group => group.items)
                .reduce((prev, curr) => [...prev, ...curr], [])
                .filter(item => event.detail.ids.map(Number).indexOf(item.id) >= 0);
            group.items.splice(event.detail.index, 0, ...newItems);
        },
        removed(event, group) {
            group.items = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) < 0
            );
        },
        reordered(event, group) {
            const reorderedItems = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) >= 0
            );
            const newItems = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) < 0
            );
            newItems.splice(event.detail.index, 0, ...reorderedItems);
            group.items = newItems;
        },
*/        
        addBookmarks(selected) {
            logger.log.debug("BookmarkView.addBookmarks : selected=",selected);
            this.v_me.bookmarks.assignExt(selected);
        },
        processSave(items) {
            const _this=this;

            let bookmarks = [];
            for (let index=0;index<items.length;index++) {
                bookmarks.push( {
                    id:items[index].bookmark_id, 
                    asset_id:items[index].api_asset.id, seq:index+1, vote:1 
                } );
            }
            let dicParam = {userid: this.v_me.id, data: bookmarks};
            logger.log.debug("BookmarkView.processSave : dicParam=",dicParam);

            this.v_me.bookmarks.addToServer(dicParam).then(resp=>{
                logger.log.debug('BookmarkView.processSave : resp=',resp);
                _this.v_me.saveToCookie();

                CommonFunc.showOkMessage(_this,'Saved');       
            }).catch(err=>{
                logger.log.error('BookmarkView.processSave : err=',err);
                CommonFunc.showErrorMessage(_this,err.data.msg);                
            });
        },
        processDelete(bookmark) {
            const _this=this;

            logger.log.debug("BookmarkView.processDelete : bookmark=",bookmark);
            
            let dicParam = {userid: this.v_me.id, id: bookmark.id};
            this.v_me.bookmarks.deleteFromServer(dicParam).then(resp=>{
                logger.log.debug("BookmarkView.processDelete : resp=",resp);
                _this.v_me.saveToCookie();
                CommonFunc.showOkMessage(_this,'Deleted');
            }).catch(err=>{
                logger.log.error("BookmarkView.processDelete : err=",err);
                CommonFunc.showErrorMessage(_this,err.data.msg);                                
            });

        },


        onClickAdd() {
            logger.log.debug("BookmarkView.onClickAdd");
            this.$refs.bookmarkDialog.show();
        },
        onClickTest() {
            logger.log.debug("BookmarkView.onClickTest : v_data=",this.v_data);
        },
        onClickSave() {
            logger.log.debug("BookmarkView.onClickSave");
            this.processSave(this.v_data);
        },
        onClickDelete(bookmark) {
            logger.log.debug("BookmarkView.onClickDelete : bookmark=",bookmark);
            this.processDelete(bookmark);
        },
        onBookmarkAdded(dicParam) {
            logger.log.debug("BookmarkView.onBookmarkAdded : dicParam=",dicParam);
            this.addBookmarks(dicParam.selected);            
        }
    }

};

</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
  margin-left : -40px;
  list-style-type: none;
}

.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>