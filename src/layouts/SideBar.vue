<template>
      <q-list>
        <q-item-label header class="text-grey-8" >
          MoA.Finance
        </q-item-label>

        <EssentialLink
          v-for="link in linksCrypto"
          :key="link.title"
          v-bind="link"
        />

        <EssentialLink
          v-for="link in linksKstock"
          :key="link.title"
          v-bind="link"
        />

      </q-list>

</template>



<script>
import EssentialLink from 'components/EssentialLink.vue';


const linkCrypto = [
  {
    title: 'Home',
    caption: '오늘의 크립토시장',
    icon: 'school',
    link: '/',
  },
  {
    title: '마켓 와치',
    caption: '마켓와치',
    icon: 'chat',
    link: '#/cwatch',
  },
  {
    title: '시장동향',
    caption: '시장동향',
    icon: 'chat',
    link: '#/trend',
  },  
  {
    title: '섹터지수',
    caption: '섹터별지수',
    icon: 'code',
    link: '#/sector',
  },
  {
    title: 'Crypto',
    caption: 'Crypto',
    icon: 'rss_feed',
    link: '#/asset',
  },
];


const linkKstock = [
  {
    title: 'World View',
    caption: '전세계 동향',
    icon: 'record_voice_over',
    link: '#/world',
  },
  {
    title: 'Market Risk',
    caption: 'Market Risk',
    icon: 'public',
    link: '#/risk',
  },
  {
    title: 'KStock Weekly',
    caption: 'Market Weekly',
    icon: 'favorite',
    link: '#/wkospi',
  },
  {
    title: 'KStock Daily',
    caption: 'Market Daily',
    icon: 'favorite',
    link: '#/dkospi',
  },
  {
    title: 'KStock Beater',
    caption: 'Market Beater',
    icon: 'favorite',
    link: '#/kbeater',
  },
  {
    title: 'KStock Instrument',
    caption: 'Instrument',
    icon: 'favorite',
    link: '#/kinstrument',
  },
];


export default {
    components: {
        EssentialLink,
    },
    data() {
        return {
            linksCrypto: linkCrypto,
            linksKstock: linkKstock,
        };

    },
}

</script>
