<template>
  <div>
    <div v-if="children.length == 0">
      
      <q-item clickable v-ripple :inset-level="level" tag="a" :href="link">
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon" />
        </q-item-section>      

        <q-item-section>{{title}}</q-item-section>
      </q-item>
    </div>
    
    <div v-else>
      <div v-if="children.length > 0">
        
        <q-expansion-item
            default-opened
            expand-separator
            :icon="icon"
            :label="title"
            :caption="caption"
            :header-inset-level="level"
            >

          <EssentialLink
            v-for="(child, i) in children" :key="i"
            v-bind="child">
          </EssentialLink>

        </q-expansion-item>
      </div>
      <div v-else>
        
        <q-item clickable v-ripple :inset-level="level" tag="a" :href="link">
          <q-item-section v-if="icon" avatar>
            <q-icon :name="icon" />
          </q-item-section>      

          <q-item-section>{{title}}</q-item-section>
        </q-item>

      </div>
    </div>
  </div>
</template>

<!--
<template>
  <q-item
    clickable
    tag="a"
    :href="link"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
-->

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },

    level: {
      type: Number,
      default: 1
    },

    children: {
      type: Array,
      default: []
    }
  },
  methods: {
    debug(title,msg) {
      //logger.log(title,msg);
    },
  }

};
</script>
