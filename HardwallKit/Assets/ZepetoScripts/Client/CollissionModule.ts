import { AnimationClip, Animator, AvatarIKGoal, CharacterController, Debug, Input, KeyCode, Transform, Vector3, Collider, GameObject, Object, MeshRenderer, BoxCollider, WaitForSeconds, Random} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Starter from './ClientStarter';

export default class CollissionModule extends ZepetoScriptBehaviour {
    private * checkIfObject(obj : GameObject) {
        if (obj.tag == 'Lava') {
            Starter.instance.respawnCharacter();
        }
    }

    OnTriggerEnter(coll: Collider) {
        this.StartCoroutine(this.checkIfObject(coll.gameObject));
    }
}