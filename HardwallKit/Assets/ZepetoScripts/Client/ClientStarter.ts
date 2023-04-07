import { Transform, WaitForSeconds, Quaternion } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers, ZepetoPlayer } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import CollissionModule from './CollissionModule';

export default class Starter extends ZepetoScriptBehaviour {
    public room : Room;
    public spawnPoint : Transform;

    public static instance : Starter;

    private localPlayer: ZepetoPlayer;
    public multiplay: ZepetoWorldMultiplay;

    public getPlayer() {
        if (this.localPlayer) {
            return this.localPlayer;
        }

        return null
    }

    public getCharacter() {
        if (this.localPlayer) {
            if (this.localPlayer.character) {
                return this.localPlayer.character;
            }
        }

        return null
    }

    public respawnCharacter() {
        let character = this.getCharacter()
        
        if (character) {
            character.Teleport(this.spawnPoint.position, new Quaternion(0, 90, 0, 0)); // move player to spawn
        }
    }

    private * clientStartup() {
        var hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);

        if (!hasPlayer) {
            while (!hasPlayer) {
                hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);

                yield new WaitForSeconds(1);
            }
        }

        const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);

        this.localPlayer = myPlayer;

        if (this.localPlayer == null) {
            while (this.localPlayer == null) {
                const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);
                this.localPlayer = myPlayer;
            }
        }

        myPlayer.character.Teleport(this.spawnPoint.position, new Quaternion(0, 90, 0, 0)); // move player to spawn
    }

    Start() {
        Starter.instance = this;

        this.multiplay.RoomCreated += (room: Room) => {
            this.room = room;

            this.StartCoroutine(this.clientStartup());
        }

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<CollissionModule>();
        });
    }

}