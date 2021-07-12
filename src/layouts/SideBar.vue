<template>
      <q-list>
        <q-item-label header class="text-grey-8" >
          WeVest
        </q-item-label>

        <EssentialLink
          v-for="link in linksMenu"
          :key="link.title"
          v-bind="link"
        />

      </q-list>

</template>



<script>
import EssentialLink from 'components/EssentialLink.vue';


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
    title: 'World View',
    caption: '전세계 동향',
    icon: 'record_voice_over',
    link: '#/world',
    level:0,
    children: []
  },  
  {
    title: 'Risk',
    caption: 'Market Risk',
    icon: 'record_voice_over',
    link: '#/risk',
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
        icon: '',
        link: '#/cryptovc',
        level: 1,
        children: []        
      },
      {
        title: 'VC Portfolio',
        caption: 'CryptoVC Portfolio',
        icon: '',
        link: '#/vcportfolio',
        level: 1,
        children: []        
      },
    ]
  }
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
