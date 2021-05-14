<template>
      <q-list>
        <q-item-label header class="text-grey-8" >
          MoA.Finance
        </q-item-label>

        <EssentialLink
          v-for="link in linksMenu"
          :key="link.title"
          v-bind="link"
        />

<!--
        <EssentialLink
          v-for="link in linksCrypto"
          :key="link.title"
          v-bind="link"
        />
        <q-expansion-item
            expand-separator
            icon="mail"
            :label="$t('name.research')"
            :caption="$t('name.research')"
            :header-inset-level="level"
            default-closed>

          <EssentialLink
            v-for="link in linksResearch"
            :key="link.title"
            v-bind="link">
          </EssentialLink>
        </q-expansion-item>

        <EssentialLink
          v-for="link in linksKstock"
          :key="link.title"
          v-bind="link"
        />
-->
      </q-list>

</template>



<script>
import EssentialLink from 'components/EssentialLink.vue';



const linksKstock = [
  {
    title: 'World View',
    caption: '전세계 동향',
    icon: 'record_voice_over',
    link: '#/world',
    level:1,
    children: []
  },
  {
    title: 'Market Risk',
    caption: 'Market Risk',
    icon: 'public',
    link: '#/risk',
    level:1,
    children: []
  },
  {
    title: 'KStock Weekly',
    caption: 'Market Weekly',
    icon: 'favorite',
    link: '#/wkospi',
    level:1,
    children: []
  },
  {
    title: 'KStock Daily',
    caption: 'Market Daily',
    icon: 'favorite',
    link: '#/dkospi',
    level:1,
    children: []
  },
  {
    title: 'KStock Beater',
    caption: 'Market Beater',
    icon: 'favorite',
    link: '#/kbeater',
    level:1,
    children: []
  },
  {
    title: 'KStock Instrument',
    caption: 'Instrument',
    icon: 'favorite',
    link: '#/kinstrument',
    level:1,
    children: []
  },
];


const linksMenu = [
  {
    title: 'Home',
    caption: '오늘의 크립토시장',
    icon: 'school',
    link: '/',
    level:0,
    children: []
  },
  {
    title: '마켓 와치',
    caption: '마켓와치',
    icon: 'chat',
    link: '#/cwatch',
    level:0,
    children: []
  },
  {
    title: '시장동향',
    caption: '시장동향',
    icon: 'chat',
    link: '#/trend',
    level:0,
    children: []
  },  
  {
    title: '섹터지수',
    caption: '섹터별지수',
    icon: 'code',
    link: '#/sector',
    level:0,
    children: []
  },
  {
    title: 'Crypto',
    caption: 'Crypto',
    icon: 'rss_feed',
    link: '#/asset',
    level:0,
    children: []
  },
  {
    title: 'Research',
    caption: 'Research',
    icon: 'rss_feed',
    link: '#',
    level:0,
    children: [
      {
        title: 'Crypto VC',
        caption: 'CryptoVC',
        icon: 'rss_feed',
        link: '#/cryptovc',
        level: 1,
        children: []        
      }
    ]
  },
  {
    title: 'KStock',
    caption: 'KStock',
    icon: 'rss_feed',
    link: '#',
    level:0,
    children: linksKstock

  },
];


export default {
    components: {
        EssentialLink,
    },
    data() {
        return {
            linksMenu: linksMenu,
        };

    },
}

</script>
