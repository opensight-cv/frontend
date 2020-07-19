<template>
  <div>
    <div class="settings">
      <pref-node title="Updates">
        <p>
          <a target="_blank" href="https://opensight-cv.github.io/quickstart/upgrading/">
            Click here
          </a>
          for a tutorial on updating.
        </p>

        <form id="update-form" enctype="multipart/form-data" method="post" name="update-form">
          <input type="file" required />
        </form>
        <p><button id="update-button">Update</button></p>
      </pref-node>

      <pref-node title="Import/Export">
        <p>Import / Export a nodetree.</p>
        <form id="import-form" enctype="multipart/form-data" method="post" name="import-form">
          <input type="file" required />
        </form>
        <p><button id="import-button">Import</button> <button id="export-button">Export</button></p>
      </pref-node>

      <pref-node title="Network Config">
        <p>
          <label for="team-number">Team Number: </label>
          <input id="team-number" v-model="teamNumber" type="number" min="1" max="9999" required />
        </p>
        <p>
          <label for="dns-mode">DNS Mode: </label>
          <select id="dns-mode" v-model="selectedDNSMode">
            <option v-for="dnsOption in dnsOptions" :key="dnsOption" :value="dnsOption">
              {{ dnsOption }}
            </option>
          </select>
        </p>
        <p>
          <label for="ip-assign">IP Assignment Mode:</label>
          <select id="ip-assign" v-model="ipAssignMode">
            <option value="DHCP">DHCP</option>
            <option value="Static">Static</option>
          </select>
        </p>
        <p>
          <label for="static-ext">Static IP Extension:</label>
          <input id="static-ext" v-model="staticExtension" type="number" min="2" max="255" step="1" />
        </p>
        <p>
          <label for="nt-enabled">NetworkTables Enabled:</label>
          <input id="nt-enabled" v-model="ntEnabled" type="checkbox" />
        </p>
        <p>
          <label for="nt-mode">NetworkTables Mode:</label>
          <select id="nt-mode" v-model="ntMode">
            <option value="client">Client</option>
            <option value="server">Server</option>
          </select>
        </p>
        <p>
          <button id="submit-network" v-on:click="postNetwork">Update</button>
        </p>
      </pref-node>

      <pref-node title="Profiles">
        <p>Current Profile: 420</p>
        <button class="profile-button">0</button>
        <button class="profile-button">1</button>
        <button class="profile-button">2</button>
        <button class="profile-button">3</button>
        <button class="profile-button">4</button>
        <br />
        <button class="profile-button">5</button>
        <button class="profile-button">6</button>
        <button class="profile-button">7</button>
        <button class="profile-button">8</button>
        <button class="profile-button">9</button>
        <br />
        <p><button>Delete Selected Profile</button></p>
      </pref-node>

      <pref-node title="Actions">
        <p><button>Restart OpenSight</button></p>
        <p><button>Restart System</button></p>
        <p><button>Shutdown System</button></p>
      </pref-node>
    </div>
    <snackbar />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { Vue, Component } from "vue-property-decorator";

import PrefNode from "@/components/ui/PrefNode.vue";
import Snackbar from "@/components/ui/Snackbar.vue";

import { getSettings, postNetworkSettings } from "@/api/api";
import { FrontendSettings, NetworkSettings } from '../api/settingSchemma';

@Component({
  components: { PrefNode, Snackbar },
})
export default class Settings extends Vue {
  teamNumber = 1072;

  selectedDNSMode = "";

  dnsOptions: string[] = [];

  ipAssignMode = "";

  ntEnabled = false;

  staticExtension = 0;

  ntMode = "";

  async created() {
    const settings = await getSettings();
    console.log(settings);
    this.dnsOptions = settings.status.network_mode;
    this.selectedDNSMode = settings.preferences.network.mode;
    this.teamNumber = Number(settings.preferences.network.team);
    this.ipAssignMode = settings.preferences.network.dhcp ? "DHCP" : "Static";
    this.staticExtension = Number(settings.preferences.network.static_ext);
    this.ntMode = settings.preferences.network.nt_client ? "client" : "server";
    this.ntEnabled = settings.preferences.network.nt_enabled;
  }

  postNetwork() {
    console.log(this.ntEnabled);
    const settings: NetworkSettings = {
      team: `${this.teamNumber}`,
      mode: this.selectedDNSMode,
      dhcp: this.ipAssignMode === "DHCP",
      static_ext: `${this.staticExtension}`,
      nt_enabled: this.ntEnabled,
      nt_client: this.ntMode === "client"
    }
    postNetworkSettings(settings).then((resp) => {
      console.log(resp);
      this.$root.$emit("snackbar-success", "Network settings were successfully updated.");
    })
  }
}
</script>

<style scoped>
.settings {
  background-color: #232323;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  padding: 2% 2%;
  box-sizing: border-box;
}

.settings > div {
  margin-right: 2%;
  margin-bottom: 2%;
}

#team-number,
#ip-assign,
#dns-mode,
#nt-enabled,
#nt-mode {
  margin-left: 4px;
}

.profile-button {
  margin-right: 2%;
  margin-bottom: 2%;
  width: 18%;
}
</style>
