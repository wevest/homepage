<template>
	<div class="row">
		<div class="col">
			<q-tabs
				v-model="tab"
				class="text-black tab_bgcolor"
				active-color="primary"
				indicated-color="primary"
				align="justify"
				dense
			>
				<q-tab
					name="intro"
					:label="$t('name.intro')"
					@click="onClickTab('intro')"
				/>
				<q-tab
					name="info"
					:label="$t('name.info')"
					@click="onClickTab('info')"
				/>
				<q-tab
					name="investor"
					:label="$t('name.investor')"
					@click="onClickTab('base')"
				/>
				<q-tab
					name="development"
					:label="$t('name.development')"
					@click="onClickTab('price')"
				/>
			</q-tabs>

			<q-tab-panels
				v-model="tab"
				animated
				dense
				vertical
				keep-alive
				transition-prev="jump-up"
				transition-next="jump-up"
			>
				<q-tab-panel name="intro" class="q-pa-none">
					<q-card flat bordered class="my-card">
						<q-card-section>
							<div class="text-h6">{{ v_info.symbol }}</div>
						</q-card-section>

						<q-separator dark inset />

						<q-card-section>
							{{ v_info.description }}
						</q-card-section>
					</q-card>
				</q-tab-panel>

				<q-tab-panel name="info" class="q-pa-none">
					<div>
						<InfoTable ref="infoTable" :data="v_asset" />
					</div>
				</q-tab-panel>

				<q-tab-panel name="investor" class="q-pa-none">
					<q-table
						title=""
						class="sticky-column-table"
						flat
						:data="v_items_vc"
						:columns="v_headers_vc"
						row-key="name"
						:rows-per-page-options="[50]"
					>
						<template v-slot:body="props">
							<q-tr :props="props">
								<q-td
									key="name"
									:props="props"
									class="caption_color"
								>
									<a
										href="#"
										@click="onClickVC(props.row.name)"
										>{{ props.row.name }}</a
									>
								</q-td>
								<q-td
									key="avg_roi"
									class="text-red text-weight-bolder"
									:props="props"
									>{{
										Number(
											props.row.avg_roi
										).toLocaleString()
									}}</q-td
								>
								<q-td key="total_ret" :props="props">{{
									Number(props.row.total_ret).toLocaleString()
								}}</q-td>
								<q-td key="homepage" :props="props">
									<a
										:href="props.row.homepage"
										target="_blank"
									>
										{{ props.row.homepage }}</a
									>
								</q-td>
								<q-td key="description" :props="props">{{
									props.row.description
								}}</q-td>
							</q-tr>
						</template>
					</q-table>
				</q-tab-panel>

				<q-tab-panel name="development" class="q-pa-none">
					<q-markup-table flat>
						<tbody class="develop-low">
							<tr>
								<td>
									<div>
										<h5>{{ $t("name.commit_count") }}</h5>
										<h6>
											{{
												Number(
													g_commit_item[
														"github_commit_count"
													]
												).toLocaleString()
											}}
										</h6>
									</div>
								</td>
								<td>
									<div>
										<h5>{{ $t("name.watcher_count") }}</h5>
										<h6>
											{{
												Number(
													g_commit_item[
														"github_watchers_count"
													]
												).toLocaleString()
											}}
										</h6>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div>
										<h5>{{ $t("name.pushed_at") }}</h5>
										<h6>
											{{
												g_commit_item[
													"github_pushed_at"
												]
											}}
										</h6>
									</div>
								</td>
								<td>
									<div>
										<h5>{{ $t("name.created_at") }}</h5>
										<h6>
											{{
												g_commit_item[
													"github_created_at"
												]
											}}
										</h6>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div>
										<h5>{{ $t("name.forks_count") }}</h5>
										<h6>
											{{
												Number(
													g_commit_item[
														"github_forks_count"
													]
												).toLocaleString()
											}}
										</h6>
									</div>
								</td>
								<td>
									<div>
										<h5>{{ $t("name.language") }}</h5>
										<h6>
											{{
												g_commit_item["github_language"]
											}}
										</h6>
									</div>
								</td>
							</tr>
						</tbody>
					</q-markup-table>

					<CTitle
						ttype="subtitle"
						:title="$t('page.asset.github.title')"
						:desc="$t('page.asset.github.desc')"
					></CTitle>
					<highcharts
						class="hc box_chart"
						:options="g_chart['chart1']"
						ref="chart1"
					></highcharts>
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>


<script>
import CommonFunc from "src/util/CommonFunc";
import APIService from "src/services/apiService";
import logger from "src/error/Logger";

import CTitle from "src/components/CTitle";
import InfoTable from "src/pages/asset/component/InfoTable";

export default {
	components: {
		CTitle,
		InfoTable
	},
	data() {
		return {
			tab: "intro",
			g_data: null,
			g_data_vc: null,
			g_data_commit: null,
			v_info: { symbol: null, description: null },

			g_chart: {
				chart1: { series: [] },
				chart2: { series: [] },
			},

			g_commit_item: {
				github_created_at: "",
				github_pushed_at: "",
				github_language: "",
				github_subscribers_count: 0,
				github_watchers_count: 0,
				github_commit_count: 0,
				github_forks_count: 0,
			},

			items: [],
			items_info: [],
			items_price: [],
			items2: [],

			v_asset: null,

			v_items_info: [],

			v_headers_vc: [
				{ name: "name", label: this.$t("name.name"), field: "name" },
				{
					name: "avg_roi",
					label: this.$t("name.roi") + "(%)",
					sortable: true,
					field: "avg_roi",
					format: (val, row) => `${Number(val).toLocaleString()}`,
				},
				{
					name: "total_ret",
					label: this.$t("name.total_return") + "(%)",
					sortable: true,
					field: "total_ret",
					format: (val, row) => `${Number(val).toLocaleString()}`,
				},
				{
					name: "homepage",
					label: this.$t("name.homepage"),
					align: "left",
					field: "homepage",
				},
				{
					name: "description",
					label: this.$t("name.description"),
					align: "left",
					field: "description",
				},
			],

			v_items_vc: [],
		};
	},

	methods: {
		filterVCData: function (items, column, vcs) {
			let new_items = [];
			let cryptovc = vcs.split(",");
			if (cryptovc.length == 0) {
				return new_items;
			}

			for (let index = 0; index < items.length; index++) {
				if (cryptovc.includes(items[index][column])) {
					new_items.push(items[index]);
				}
			}
			return new_items;
		},

		update(asset) {},

		updateTable: function (data_base, data_vc) {
			const dic_columns = CommonFunc.getColumnDic(
				data_base.columns,
				[],
				[]
			);
			const dic_columns_vc = CommonFunc.getColumnDic(
				data_vc.columns,
				[],
				[]
			);
			let a_vc = data_base["values"][0][dic_columns["cryptovc"]];
			//logger.log.debug('items=',a_vc, dic_columns,);
			logger.log.debug("locale=", this.$i18n.locale);

			this.v_info.symbol = data_base["values"][0][dic_columns["symbol"]];

			let a_desc = data_base["values"][0][dic_columns["description"]];
			if (this.$i18n.locale == "kr") {
				if (
					data_base["values"][0][dic_columns["description_kr"]]
						.length > 20
				) {
					a_desc =
						data_base["values"][0][dic_columns["description_kr"]];
				}
			}

			this.v_info.description = a_desc;

			let items = CommonFunc.formatArrayToJson(data_vc);
			let items_vc = this.filterVCData(items, "name", a_vc);
			this.v_items_vc = items_vc;

			this.updateInfoTable(data_base);

			/*
            let items = [];
            for (let index=0;index<data_vc['values'].length;index++) {
              let a_item = {};
              for (let index2=0;index2<data_vc['columns'].length;index2++) {
                a_item[data_vc['columns'][index2]] = data_vc['values'][index][dic_columns_vc[data_vc['columns'][index2]]];
              }
              items.push( a_item );
            }

            this.items = items;
            logger.log.debug('items=',items);

            //this.items = items;            
*/
		},

		getFirstLink: function (json_data, dic_columns, column) {
			let a_links = json_data["values"][0][dic_columns[column]];
			if (a_links.length == 0) {
				return "";
			}
			return a_links.split(",")[0];
		},

		updateInfoTable: function (json_data) {
			const dic_columns = CommonFunc.getColumnDic(
				json_data.columns,
				[],
				[]
			);
			logger.log.debug("items=", dic_columns);

			//this.g_symbol = json_data['values'][0][dic_columns['symbol']];
			//this.g_description = json_data['values'][0][dic_columns['description']];

			let items = [];

			//items.push( {column:'symbol', type:1, desc:json_data['values'][0][dic_columns['symbol']]} );
			//items.push( {column:'name', type:1, desc:json_data['values'][0][dic_columns['name']]} );

			items.push({
				column: "alltime_high",
				desc: this.getPriceDate(json_data, dic_columns, "alltime_high"),
			});
			items.push({
				column: "alltime_low",
				desc: this.getPriceDate(json_data, dic_columns, "alltime_low"),
			});
			items.push({
				column: "w52_high",
				desc: this.getPriceDate(json_data, dic_columns, "w52_high"),
			});
			items.push({
				column: "w52_low",
				desc: this.getPriceDate(json_data, dic_columns, "w52_low"),
			});

			items.push({
				column: "max_supply",
				type: 1,
				desc: CommonFunc.formatNumber(
					json_data["values"][0][dic_columns["max_supply"]],
					0,
					true
				),
			});
			items.push({
				column: "total_supply",
				type: 1,
				desc: CommonFunc.formatNumber(
					json_data["values"][0][dic_columns["total_supply"]],
					0,
					true
				),
			});
			items.push({
				column: "circulating_supply",
				type: 1,
				desc: CommonFunc.formatNumber(
					json_data["values"][0][dic_columns["circulating_supply"]],
					0,
					true
				),
			});
			items.push({
				column: "website",
				type: 0,
				desc: json_data["values"][0][dic_columns["website"]],
			});
			items.push({
				column: "github",
				type: 0,
				desc: json_data["values"][0][dic_columns["source_code"]],
			});
			items.push({
				column: "announcement",
				type: 0,
				desc: json_data["values"][0][dic_columns["announcement"]],
			});
			items.push({
				column: "source_code",
				type: 0,
				desc: json_data["values"][0][dic_columns["source_code"]],
			});
			items.push({
				column: "twitter",
				type: 0,
				desc: json_data["values"][0][dic_columns["twitter"]],
			});
			items.push({
				column: "chat",
				type: 0,
				desc: json_data["values"][0][dic_columns["chat"]],
			});
			items.push({
				column: "explorer",
				type: 0,
				desc: this.getFirstLink(json_data, dic_columns, "explorer"),
			});
			items.push({
				column: "token_address",
				type: 1,
				desc: json_data["values"][0][dic_columns["token_address"]],
			});
			items.push({
				column: "date_added",
				type: 1,
				desc: json_data["values"][0][dic_columns["date_added"]],
			});

			/*
            this.items_info = items;

            let items2 = [];
              
            items2.push( {column:'symbol', desc:json_data['values'][0][dic_columns['symbol']]} );
            items2.push( {column:'first traded date', desc:json_data['values'][0][dic_columns['date_added']]} );
            
            items2.push( {column:'alltime_high', desc:this.getPriceDate(json_data,dic_columns,'alltime_high')} );              
            items2.push( {column:'alltime_low', desc:this.getPriceDate(json_data,dic_columns,'alltime_low')} );              
            items2.push( {column:'w52_high', desc:this.getPriceDate(json_data,dic_columns,'w52_high')} );              
            items2.push( {column:'w52_low', desc:this.getPriceDate(json_data,dic_columns,'w52_low')} );
          
            this.items_price = items2;
*/

			logger.log.debug("items=", items);

			this.v_items_info = items;
		},

		updateDevWidget(data_base) {
			const dic_columns = CommonFunc.getColumnDic(
				data_base.columns,
				[],
				[]
			);
			let a_crated_date =
				data_base["values"][0][dic_columns["github_created_at"]];
			let a_updated_date =
				data_base["values"][0][dic_columns["github_pushed_at"]];

			this.g_commit_item["github_created_at"] = CommonFunc.safeSplit(
				a_crated_date,
				"T"
			)[0];
			this.g_commit_item["github_pushed_at"] = CommonFunc.safeSplit(
				a_updated_date,
				"T"
			)[0];
			this.g_commit_item["github_forks_count"] =
				data_base["values"][0][dic_columns["github_forks_count"]];
			this.g_commit_item["github_commit_count"] =
				data_base["values"][0][dic_columns["github_commit_count"]];
			this.g_commit_item["github_watchers_count"] =
				data_base["values"][0][dic_columns["github_watchers_count"]];
			this.g_commit_item["github_subscribers_count"] =
				data_base["values"][0][dic_columns["github_subscribers_count"]];
			this.g_commit_item["github_language"] =
				data_base["values"][0][dic_columns["github_language"]];
		},

		update(data_base, data_vc) {
			logger.log.debug("CAssetInfoTable.update - ", data_base);
			this.g_data = data_base;
			this.g_data_vc = data_vc;

			this.updateTable(this.g_data, this.g_data_vc);
			this.updateDevWidget(this.g_data);
		},

		updateCommitChart(json_data) {
			let data_count = CommonFunc.getChartData(
				json_data,
				"commit",
				"commit_count",
				"time",
				false,
				0
			);

			let series = [
				{
					name: this.$t("name.count"),
					type: "column",
					yAxis: 0,
					data: data_count.data,
				},
			];

			let a_option = CommonFunc.getChartOption(series);
			this.g_chart["chart1"] = a_option;
		},

		updateChart(data_commit) {
			logger.log.debug("CAssetInfoTable.updateChart - ", data_commit);
			this.g_data_commit = data_commit;
			this.updateCommitChart(data_commit);
		},

		onClickTab(value) {
			logger.log.debug("CAssetInfo.onClick - ", value);
			//this.updateTable(this.g_data,value);
			//this.loadGithubData(this.g_data);
		},

		onClickVC(vc) {
			logger.log.debug("CAssetInfo.onClick - ", vc);
			let dic_param = { name: "cryptovc", params: {} };
			this.$router.push(dic_param);
		},
	},
};
</script>


<style scoped>
.vc_desc {
	width: 300px;
	word-break: break-all;
	word-wrap: break-word;
}
.text-left {
	color: #464646;
	font-size: 12px;
	font-weight: 500;
}

.text-right {
	color: #5f5f5f;
	font-size: 12px;
	font-weight: 700;
}

.investor {
	text-align: left;
	color: #464646;
}

.investor_name {
	text-align: left;
	font-size: 12px;
}

.develop-low {
	line-height: 0.2rem;
}

.develop-low h5 {
	color: #464646;
	font-size: 12px;
	margin-top: -0.6rem;
	margin-bottom: 0rem;
}

.develop-low h6 {
	color: #5f5f5f;
	font-size: 16px;
	font-weight: bold;
	margin-top: -0.6rem;
	margin-bottom: 0rem;
}
</style>

