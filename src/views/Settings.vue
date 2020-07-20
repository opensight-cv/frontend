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
          <input type="file" required @change="updateFile = $event.target.files[0]" />
        </form>
        <p>
          <button id="update-button" :disabled="!updateEnabled" @click="postUpdate">Update</button>
        </p>
      </pref-node>

      <pref-node title="Import/Export">
        <p>Import / Export a nodetree.</p>
        <form id="import-form" enctype="multipart/form-data" method="post" name="import-form">
          <input type="file" required @change="nodetreeFile = $event.target.files[0]" />
        </form>
        <p>
          <button id="import-button" :disabled="!nodetreeEnabled" @click="postNodetree">
            Import
          </button>
          <button id="export-button" @click="exportNodetree">Export</button>
        </p>
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
          <input
            id="static-ext"
            v-model="staticExtension"
            type="number"
            min="2"
            max="255"
            step="1"
          />
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
          <button id="submit-network" @click="postNetwork">Update</button>
        </p>
      </pref-node>

      <pref-node title="Profiles">
        <p>Current Profile: <span v-text="currentProfile"></span></p>
        <button class="profile-button" @click="selectProfile($event)">0</button>
        <button class="profile-button" @click="selectProfile($event)">1</button>
        <button class="profile-button" @click="selectProfile($event)">2</button>
        <button class="profile-button" @click="selectProfile($event)">3</button>
        <button class="profile-button" @click="selectProfile($event)">4</button>
        <br />
        <button class="profile-button" @click="selectProfile($event)">5</button>
        <button class="profile-button" @click="selectProfile($event)">6</button>
        <button class="profile-button" @click="selectProfile($event)">7</button>
        <button class="profile-button" @click="selectProfile($event)">8</button>
        <button class="profile-button" @click="selectProfile($event)">9</button>
        <br />
        <p><button @click="deleteCurrentProfile">Delete Selected Profile</button></p>
      </pref-node>

      <pref-node title="Actions">
        <p><button @click="restart(false)">Restart OpenSight</button></p>
        <p><button @click="shutdown(false)">Stop OpenSight</button></p>
        <p><button v-if="daemon" @click="restart(true)">Restart System</button></p>
        <p><button v-if="daemon" @click="shutdown(true)">Shutdown System</button></p>
      </pref-node>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase, no-console */

import { Vue, Component } from "vue-property-decorator";

import PrefNode from "@/components/ui/PrefNode.vue";

import {
  getSettings,
  postUpdate,
  postNetworkSettings,
  postNodetreeFile,
  getNodetree,
  postProfile,
  deleteCurrentProfile,
  postRestart,
  postShutdown,
} from "@/api/api";
import { NetworkSettings } from "../api/settingSchemma";

@Component({
  components: { PrefNode },
})
export default class Settings extends Vue {
  updateEnabled = true;
  updateFile?: File;

  nodetreeEnabled = true;
  nodetreeFile?: File;

  teamNumber = 1072;
  selectedDNSMode = "";
  dnsOptions: string[] = [];
  ipAssignMode = "";
  ntEnabled = false;
  staticExtension = 0;
  ntMode = "";

  currentProfile = 0;

  daemon = false;

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

    this.currentProfile = settings.preferences.profile;

    this.daemon = settings.status.daemon;
  }

  postUpdate() {
    if (this.updateFile == null) {
      this.$root.$emit("snackbar-error", "You must select an update file.");
      return;
    }

    const data = new FormData();
    data.append("file", this.updateFile);
    this.updateEnabled = false;
    postUpdate(data)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Update has been initiated.");
      })
      .catch(this.handleError)
      .then(() => {
        this.updateEnabled = true;
      });
  }

  postNodetree() {
    if (this.nodetreeFile == null) {
      this.$root.$emit("snackbar-error", "You must select a nodetree file.");
      return;
    }

    postNodetreeFile(this.nodetreeFile)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Nodetree has been uploaded.");
      })
      .catch(this.handleError)
      .then(() => {
        this.nodetreeEnabled = true;
      });
  }

  async exportNodetree() {
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(await getNodetree())]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "nodetree.opsi");
    document.body.appendChild(link);
    link.click();
  }

  postNetwork() {
    console.log(this.ntEnabled);
    const settings: NetworkSettings = {
      team: `${this.teamNumber}`,
      mode: this.selectedDNSMode,
      dhcp: this.ipAssignMode === "DHCP",
      static_ext: `${this.staticExtension}`,
      nt_enabled: this.ntEnabled,
      nt_client: this.ntMode === "client",
    };
    postNetworkSettings(settings)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Network settings were successfully updated.");
      })
      .catch(this.handleError);
  }

  selectProfile(event: Event) {
    const profileID = Number((event.target as HTMLElement).innerText);
    postProfile(profileID)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", `Profile ${profileID} selected.`);
        this.currentProfile = profileID;
      })
      .catch(this.handleError);
  }

  deleteCurrentProfile() {
    deleteCurrentProfile()
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Profile successfully deleted.");
      })
      .catch(this.handleError);
  }

  restart(host: boolean) {
    postRestart(host)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Restart has been initiated.");
      })
      .catch(this.handleError);
  }

  shutdown(host: boolean) {
    postShutdown(host)
      .then((resp) => {
        console.log(resp);
        this.$root.$emit("snackbar-success", "Restart has been initiated.");
      })
      .catch(this.handleError);
  }

  handleError(message: Error) {
    console.error(message);
    this.$root.$emit("snackbar-error", "An unexpected error occured.");
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
