<template>
  	<div class="editor q-pa-md">
		<div v-if="v_loading_image">
    		<q-linear-progress indeterminate size="md" />
		</div>

    	<editor-menu-bar
			:editor="editor"
			v-slot="{ commands, isActive, getMarkAttrs }"
			v-if="!options.readonly"
		>
      		<div class="menubar">

				<span v-if="toolbar=='1'">
					<span>
						<q-btn flat dense label="" icon="undo" @click.prevent="commands.undo" />        
						<q-btn flat dense label="" icon="redo" @click.prevent="commands.redo" />	
					</span>										

					<span class="q-pl-sm">
<!--						
						<q-btn flat dense label="h1" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click.prevent="commands.heading({ level: 1 })" />
						<q-btn flat dense label="h2" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click.prevent="commands.heading({ level: 2 })" />
						<q-btn flat dense label="h3" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click.prevent="commands.heading({ level: 3 })" />
-->					
						<q-btn flat dense label="h1" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 4 }) }" @click.prevent="commands.heading({ level: 4 })" />
						<q-btn flat dense label="h2" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 5 }) }" @click.prevent="commands.heading({ level: 5 })" />
						<q-btn flat dense label="h3" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 6 }) }" @click.prevent="commands.heading({ level: 6 })" />

						<q-btn flat dense label="" icon="view_headline" class="menubar__button" :class="{ 'is-active': isActive.paragraph() }" @click.prevent="commands.paragraph" /> 


						<q-btn flat dense label="" icon="format_bold" class="menubar__button" :class="{ 'is-active': isActive.bold() }" @click.prevent="commands.bold" />
						<q-btn flat dense label="" icon="format_italic" class="menubar__button" :class="{ 'is-active': isActive.italic() }" @click.prevent="commands.italic" />
						<q-btn flat dense label="" icon="strikethrough_s" class="menubar__button" :class="{ 'is-active': isActive.strike() }" @click.prevent="commands.strike" />
						<q-btn flat dense label="" icon="format_underlined" class="menubar__button" :class="{ 'is-active': isActive.underline() }" @click.prevent="commands.underline" />
						
						<q-btn flat dense label="" icon="integration_instructions" class="menubar__button" :class="{ 'is-active': isActive.code_block() }" @click.prevent="commands.code_block" />						
						<q-btn flat dense label="" icon="code" class="menubar__button" :class="{ 'is-active': isActive.code() }" @click.prevent="commands.code" />
<!--						
						<q-btn flat dense label="link" class="menubar__button" :class="{ 'is-disabled': shouldDisableButton(isActive.link()), 'is-active': isActive.link() }" @click.prevent="isActive.link() ? changeLinkDialog(commands.link, getMarkAttrs('link')) : addLinkDialog(commands.link, getMarkAttrs('link'))" />
-->
						<q-btn flat dense label="" icon="format_list_bulleted" class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click.prevent="commands.bullet_list" />
						<q-btn flat dense label="" icon="format_list_numbered" class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click.prevent="commands.ordered_list" />
						<q-btn flat dense label="" icon="format_quote" class="menubar__button" :class="{ 'is-active': isActive.blockquote() }" @click.prevent="commands.blockquote" />
						<q-btn flat dense label="" icon="horizontal_rule" class="menubar__button" @click.prevent="commands.horizontal_rule" />

						<q-btn flat dense label="" icon="view_module" class="menubar__button"
							@click.prevent="commands.createTable({
								rowsCount: 3,
								colsCount: 3,
								withHeaderRow: true
							})"
						/>

						<span v-if="isActive.table()">
							<q-btn flat dense label="" @click.prevent="commands.deleteTable">
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z M12.2898787,17 L9,17 L9,22 L12.6736312,22 C13.0297295,22.7496048 13.515133,23.4258795 14.1010173,24 L5,24 C2.23857625,24 -1.43817996e-15,21.7614237 -1.77635684e-15,19 L-3.55271368e-15,5 C-3.89089055e-15,2.23857625 2.23857625,5.07265313e-16 5,-1.77635684e-15 L19,-1.77635684e-15 C21.7614237,-2.28362215e-15 24,2.23857625 24,5 L24,7.82313285 C24.0122947,7.88054124 24.0187107,7.93964623 24.0187107,8 C24.0187107,8.06035377 24.0122947,8.11945876 24,8.17686715 L24,14.1010173 C23.4258795,13.515133 22.7496048,13.0297295 22,12.6736312 L22,9 L17,9 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,9 L9,9 L9,15 L13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 Z M17,7 L22,7 L22,5 C22,3.34314575 20.6568542,2 19,2 L17,2 L17,7 Z M15,7 L15,2 L9,2 L9,7 L15,7 Z M7,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,7 L7,7 L7,2 Z M2,9 L2,15 L7,15 L7,9 L2,9 Z M2,17 L2,19 C2,20.6568542 3.34314575,22 5,22 L7,22 L7,17 L2,17 Z"/>
									</svg>
								</q-icon>
							</q-btn>

							<q-btn flat dense label="" @click.prevent="commands.addColumnBefore">  
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										  <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M2,19 C2,20.6568542 3.34314575,22 5,22 C6.65685425,22 8,20.6568542 8,19 L8,5 C8,3.34314575 6.65685425,2 5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-2.7585502e-16,19 L5.81397739e-16,5 C-1.37692243e-16,2.23857625 2.23857625,0 5,0 C7.76142375,0 10,2.23857625 10,5 L10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 4.43234962e-16,21.7614237 -2.7585502e-16,19 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.addColumnAfter">
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M5,14 C7.76005315,14.0033061 9.99669388,16.2399468 10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 1.77635684e-15,21.7614237 1.77635684e-15,19 C1.77635684e-15,16.2385763 2.23857625,14 5,14 Z M7.5,19.9375 C8.01776695,19.9375 8.4375,19.517767 8.4375,19 C8.4375,18.482233 8.01776695,18.0625 7.5,18.0625 L6.25,18.0625 C6.07741102,18.0625 5.9375,17.922589 5.9375,17.75 L5.9375,16.5 C5.9375,15.982233 5.51776695,15.5625 5,15.5625 C4.48223305,15.5625 4.0625,15.982233 4.0625,16.5 L4.0625,17.75 C4.0625,17.922589 3.92258898,18.0625 3.75,18.0625 L2.5,18.0625 C1.98223305,18.0625 1.5625,18.482233 1.5625,19 C1.5625,19.517767 1.98223305,19.9375 2.5,19.9375 L3.75,19.9375 C3.92258898,19.9375 4.0625,20.077411 4.0625,20.25 L4.0625,21.5 C4.0625,22.017767 4.48223305,22.4375 5,22.4375 C5.51776695,22.4375 5.9375,22.017767 5.9375,21.5 L5.9375,20.25 C5.9375,20.077411 6.07741102,19.9375 6.25,19.9375 L7.5,19.9375 Z M16,19 C16,20.6568542 17.3431458,22 19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 C17.3431458,2 16,3.34314575 16,5 L16,19 Z M14,19 L14,5 C14,2.23857625 16.2385763,0 19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.addRowBefore">
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										  <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M5,2 C3.34314575,2 2,3.34314575 2,5 C2,6.65685425 3.34314575,8 5,8 L19,8 C20.6568542,8 22,6.65685425 22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 Z M5,0 L19,0 C21.7614237,-5.07265313e-16 24,2.23857625 24,5 C24,7.76142375 21.7614237,10 19,10 L5,10 C2.23857625,10 3.38176876e-16,7.76142375 0,5 C-1.2263553e-15,2.23857625 2.23857625,5.07265313e-16 5,0 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.addRowAfter"> 
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M19,0 C21.7600532,0.00330611633 23.9966939,2.23994685 24,5 C24,7.76142375 21.7614237,10 19,10 C16.2385763,10 14,7.76142375 14,5 C14,2.23857625 16.2385763,0 19,0 Z M21.5,5.9375 C22.017767,5.9375 22.4375,5.51776695 22.4375,5 C22.4375,4.48223305 22.017767,4.0625 21.5,4.0625 L20.25,4.0625 C20.077411,4.0625 19.9375,3.92258898 19.9375,3.75 L19.9375,2.5 C19.9375,1.98223305 19.517767,1.5625 19,1.5625 C18.482233,1.5625 18.0625,1.98223305 18.0625,2.5 L18.0625,3.75 C18.0625,3.92258898 17.922589,4.0625 17.75,4.0625 L16.5,4.0625 C15.982233,4.0625 15.5625,4.48223305 15.5625,5 C15.5625,5.51776695 15.982233,5.9375 16.5,5.9375 L17.75,5.9375 C17.922589,5.9375 18.0625,6.07741102 18.0625,6.25 L18.0625,7.5 C18.0625,8.01776695 18.482233,8.4375 19,8.4375 C19.517767,8.4375 19.9375,8.01776695 19.9375,7.5 L19.9375,6.25 C19.9375,6.07741102 20.077411,5.9375 20.25,5.9375 L21.5,5.9375 Z M5,16 C3.34314575,16 2,17.3431458 2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 C22,17.3431458 20.6568542,16 19,16 L5,16 Z M5,14 L19,14 C21.7614237,14 24,16.2385763 24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 3.38176876e-16,21.7614237 0,19 C-1.2263553e-15,16.2385763 2.23857625,14 5,14 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.deleteColumn"> 
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M12.6414391,21.9312708 C12.9358807,22.5689168 13.3234155,23.1547532 13.7866134,23.6713497 C13.2317936,23.8836754 12.6294813,24 12,24 C9.23857625,24 7,21.7614237 7,19 L7,5 C7,2.23857625 9.23857625,0 12,0 C14.7614237,0 17,2.23857625 17,5 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,5 C15,3.34314575 13.6568542,2 12,2 C10.3431458,2 9,3.34314575 9,5 L9,19 C9,20.6568542 10.3431458,22 12,22 C12.220157,22 12.4347751,21.9762852 12.6414391,21.9312708 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.deleteRow">
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 L5,17 C2.23857625,17 3.38176876e-16,14.7614237 0,12 C-1.2263553e-15,9.23857625 2.23857625,7 5,7 L19,7 C21.7614237,7 24,9.23857625 24,12 C24,12.6294813 23.8836754,13.2317936 23.6713497,13.7866134 C23.1547532,13.3234155 22.5689168,12.9358807 21.9312708,12.6414391 C21.9762852,12.4347751 22,12.220157 22,12 C22,10.3431458 20.6568542,9 19,9 L5,9 C3.34314575,9 2,10.3431458 2,12 C2,13.6568542 3.34314575,15 5,15 L13.2546893,15 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z"/>
									</svg>
								</q-icon>
							</q-btn>
							<q-btn flat dense label="" @click.prevent="commands.toggleCellMerge"> 
								<q-icon class="q-px-sm">								
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-1.16403344e-15,19 L-3.0678068e-16,5 C-6.44957556e-16,2.23857625 2.23857625,0 5,0 L19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 9.50500275e-16,21.7614237 -1.16403344e-15,19 Z M12,10 C12.5522847,10 13,10.4477153 13,11 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,11 C11,10.4477153 11.4477153,10 12,10 Z M12,16 C12.5522847,16 13,16.4477153 13,17 L13,20 C13,20.5522847 12.5522847,21 12,21 C11.4477153,21 11,20.5522847 11,20 L11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,3 C12.5522847,3 13,3.44771525 13,4 L13,7 C13,7.55228475 12.5522847,8 12,8 C11.4477153,8 11,7.55228475 11,7 L11,4 C11,3.44771525 11.4477153,3 12,3 Z"/>
									</svg>
								</q-icon>
							</q-btn>
						</span>
<!--
						<q-btn @click.prevent="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': isActive({ textAlign: 'left' }) }" />
						<q-btn @click.prevent="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" />
						<q-btn @click.prevent="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" />
						<q-btn @click.prevent="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" />
						<q-btn @click.prevent="editor.chain().focus().unsetTextAlign().run()" />
-->
					</span>
				</span>

				<q-btn flat dense label="" icon="link" @click="onClickLink(commands.image)" />
				<q-btn flat dense label="" icon="image" :loading="v_loading_image" @click="onClickImage(commands.image)" />
				<q-btn flat dense label="" icon="videocam" @click="onClickYoutube" />

<!--				
				<q-btn flat label="Test" @click="onClickTest" />					
				<q-btn flat label="EMOJI" :color="v_emoji_color" @click="onClickEmoji" />
-->

      		</div>

    	</editor-menu-bar>

    	<editor-content class="editor__content" :editor="editor" />

<!--		
		<q-input type="textarea" v-model="v_test" />
-->

		<Picker :data="emojiIndex" set="twitter" @select="showEmoji" v-show="v_show_emoji" />

        <EditDialog ref="dialogEdit" buttonCaption="OK"
            :title="$t('dialog.edit_dialog.biography.title')" 
            @onSave="onSaveEdit" />
		
  	</div>

</template>

<script>
import { DOMParser } from 'prosemirror-model';
import { Editor,EditorContent,EditorMenuBar,} from "tiptap";

import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Italic,
    Link,
    Image,
    Strike,
    Underline,
    Code,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    History,
    TrailingNode,
} from "tiptap-extensions";

//import TextAlign from 'tiptap-extension-text-align';

import Iframe from 'src/components/tiptap/Iframe.js';
import EditDialog from "src/components/dialogs/EditDialog";

import { store } from 'src/store/store';
import { CONST } from 'src/data/const';
import { Config } from 'src/data/Config';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import APIService from 'src/services/apiService';


import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);

export default {
    components: {
		Picker,
        EditDialog,
		EditorContent,
        EditorMenuBar,
    },
    props: {
        options: Object,
		toolbar: {
			default: '0'
		},
        contents: {
			type:String,
			default: '',
		}
        // readonly: read only if true
        // autoFocus: Focus the editor on init
        // supportImage: upload and link images
        // supportVideo: embed video
    },
	computed: {
		v_me() {
			return store.getters.me;
		},
		v_emoji_color() {
			if (this.v_show_emoji) {
				return "primary";
			}
			return "";
		}
	},
    data () {
        return {
			v_show_emoji: false,
			v_loading_image: false,

			editor: null,
			imageDialog: false,
			videoDialog: false,
			imageTab: null,
			
			v_contents: {
				body: '',
				link_url: null,
				youtube_url: null,
			},

			v_test: null,

 			emojiIndex: emojiIndex,
      		emojisOutput: ""			
        }
    },
    mounted () {
		this.prepare();
    },
    beforeDestroy () {
        this.editor.destroy();
    },
    methods: {
		prepare() {
			this.editor = new Editor ({
				editable: !this.options.readonly,
				extensions: [
					new Blockquote(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1,2,3,4,5,6] }),
					new HorizontalRule(),
					new BulletList(),
					new OrderedList(),
					new ListItem(),
					new TodoItem(),
					new TodoList(),
					new Bold(),
					new Italic(),
					new Link({openOnClick: true,target: '_blank',}),
					new Image(),
					new Strike(),
					new Underline(),
					new Code(),
					new Table({resizable: true,}),
					new TableHeader(),
					new TableCell(),
					new TableRow(),
					new History(),
					new TrailingNode(),
					new Iframe(),
				],
				onUpdate: ({ getHTML }) => {
					this.options.content = getHTML()
				},
				content: this.contents,
				autoFocus: this.options.autoFocus,
			})
		},

		getContents() {			
			this.v_contents.body = this.editor.getHTML();
			return this.v_contents;
		},
		setContents(txt) {
			this.v_contents.body = txt;
			this.editor.setContent(this.v_contents.body);
		},

        shouldDisableButton(isActive) {
        	return !isActive & window.getSelection().isCollapsed;
        },
/*		
        addLinkDialog: async function (command) {
			if (window.getSelection().isCollapsed) {
				return;
			}
			let res = await window.prompt('Add link', 'https://');
			if (res && res != 'https://' && res != 'http://') {
				command({ href: res });
			}
        },
        changeLinkDialog: async function (command, attr) {
			let res = await window.prompt('Change link', attr.href);
			if (res != undefined) {
				if (res == 'http://' || res == 'https://') {
					res = '';
				}
				command({ href: res });
			}
        },
*/
        insertHTML({ state, view }, value) {
			logger.log.debug("insertHTML:value=",value);

			const { selection } = state;
			const element = document.createElement('div');
			element.innerHTML = value.trim();
			const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
			const transaction = state.tr.insert(selection.anchor, slice.content);
			view.dispatch(transaction);
		},

        insertVideo(url) {
			if ( (!url.includes('youtube.com/')) && (!url.includes('youtu.be/'))) {
				CommonFunc.showErrorMessage(this,'Please use youtube link');
				return;
			}

			//let embed = '<iframe src={src} width="320" height="180"></iframe>'.replace('{src}', url);			
			//let embed = '<iframe src={src}></iframe>'.replace('{src}', url);			
			let embed = '<iframe src={src} style="display:block; width:40vw; height: 40vh"></iframe>'.replace('{src}', url);
			this.insertHTML(this.editor, embed);

			return;
        },

		insertEmoji() {
			//https://jangwonseok.me/logs/91
		},


		insertLinkPreview(url) {
			const _this=this;
			logger.log.debug("TipTap.insertLinkPreview : url=",url);

            APIService.getLinkPreview({url:url}).then(resp=>{
                logger.log.debug("insertLinkPreview : resp=",resp);
                
                let a_html = _this.getLinkPreviewHTML(resp.data.data);
                logger.log.debug("insertLinkPreview : html=",a_html);
				_this.insertHTML(_this.editor, a_html);

            }).catch(err=>{

            });
		},

        async convertFile(file) {
            let img = await CommonFunc.loadImageFile(file);
            logger.log.debug("imageHandler : img=",img);
            let blob = await CommonFunc.slimImage(img);
            logger.log.debug("imageHandler : blob=",blob);
            return blob;
        },

        async uploadFiles(command,files) {
            const _this = this;
            
            const formData = new FormData();
            for (let index=0;index<files.length;index++) {
                let img = await CommonFunc.loadImageFile(files[index]);
                //logger.log.debug("imageHandler : img=");
                let blob = await CommonFunc.slimImage(img,0.7);
                //logger.log.debug("imageHandler : blob=",blob);
                //form.append(avatar.uploadFormName, blob_avatar, avatar.filename); 
                formData.append('files',blob,files[index].name);                
            }
            //logger.log.debug("imageHandler : formData=",formData);
			
			this.v_loading_image = true;			
            this.v_me.uploadImage(formData).then(resp=>{
                logger.log.debug("uploadFiles.uploadImage : resp=",resp);
                if (resp.data.ret!=0) {
                    return;
                }
                _this.uploadToEditor(command,resp.data.data);

				_this.v_loading_image = false;
            }).catch(err=>{
                logger.log.error("uploadFiles.uploadImage : err=",err);
				_this.v_loading_image = false;
            });
            
        },

        uploadToEditor(command,dicUrls) {
			logger.log.debug('uploadToEditor : command=',command);
            for (let a_key in dicUrls) {
				//this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 
				const a_url = dicUrls[a_key];
				logger.log.debug('uploadToEditor : url=',a_url);

				command({ src:a_url });
				this.insertHTML(this.editor, "<br>");
            }
        },

        imageHandler(command) {     
            const _this=this;
			
			return new Promise(function(resolve, reject) {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'image/*');
				input.setAttribute('multiple','true');
				input.click();

				input.onchange = async () => {
					_this.uploadFiles(command,input.files);
					resolve(input);
				}
			});

        },

        extractVideoUrl(url) {
            let match =
                url.match(
                /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/,
                ) ||
                url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (match) {
                return `${match[1] || 'https'}://www.youtube.com/embed/${
                match[2]
                }?showinfo=0`;
            }
            // eslint-disable-next-line no-cond-assign
            if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
                return `${match[1] || 'https'}://player.vimeo.com/video/${match[2]}/`;
            }
            return url;
        },

        getLinkPreviewHTML(preview) {
            let html = '';
			html = '<hr />';
			html += '<a href="' + preview.url + '" >';
			html += '<img src="' + preview.img + '" />';
			//html += '      <span class="link-url">' + preview.url + '</span>';			
			html += '<br>';
			html += '<span>' + preview.site_name + '</span>';
			html += '<br>';
			html += '<strong>' + preview.title + '</strong>';
			html += '<br>';
			html += '<span>'+preview.description+'</span>';
			html += '</a>';
			html += '<hr />';

            return html;
        },

    	showEmoji(emoji) {
			//https://github.com/serebrov/emoji-mart-vue
      		this.emojisOutput = this.emojisOutput + emoji.native;
			logger.log.debug('showEmoji : emoji=',this.emojisOutput);
    	},

        postToServer(v_post,a_tag) {                        
            const _this = this;
            //let a_text = this.getContents();
            
            let dic_param = {
                id: v_post.id,
                title: v_post.title,
                tags: v_post.tags, 
                category_id: v_post.category, 
                content_type: v_post.content_type,
                asset_id: v_post.asset_id,
                youtube_url: v_post.youtube_url,                
                image_url: v_post.image_url,
                link_url: v_post.link_url, 
				live: v_post.live,
                text: CommonFunc.addHashTag(v_post.body,a_tag),                
                token:store.getters.token,                
            };

            if (v_post.content_type==CONST.CONENT_TYPE_ASSET_ANSWER) {
                dic_param.question_id = v_post.question_id; 
            }

            logger.log.debug("BaseEditor.onClickSave : dic_param=",dic_param);

            v_post.post(dic_param).then( response => {
                logger.log.debug("onClickSave : response=",response);
                _this.$emit("onPostSave",{ret:1, response:response});
            }).catch(err=>{
                _this.$emit("onPostSave",{ret:0, response:error});
            });
        },


		onClickYoutube() {			
			logger.log.debug('onClickLink : html=',this.v_contents.body);
            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('youtube','text',"",'Youtube Link');
		},

		onClickLink(command) {
            logger.log.debug('onClickLink : command=',command);
            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('link','text',"",'Link');
		},
		onClickImage(command) { 
			logger.log.debug('onClickImage : command=',command);
			this.imageHandler(command);
		},
		onClickTest() {
			logger.log.debug("TweetWriter.onClickTest");
			let a_html = "<div style='font-size:20px;'> asfsdafasdf</div>";
			this.insertHTML(this.editor, this.v_test);
		},

		onClickEmoji() {
			this.v_show_emoji = ! this.v_show_emoji;
		},

        onSaveEdit(dicParam) {
            logger.log.debug("TweetWriter.onSaveEdit : ",dicParam);

            if (dicParam.tag=="youtube") {
                this.v_contents.youtube_url = this.extractVideoUrl(dicParam.value);
				this.insertVideo(this.v_contents.youtube_url);
            } else if (dicParam.tag=="link") {
                this.v_contents.link_url = dicParam.value;
                this.insertLinkPreview(this.v_contents.link_url);
            }

            //this.updateUserProfile(this.v_user);

        },

    }
}
</script>

<style lang="scss">
@import 'src/assets/sass/main.scss';
</style>