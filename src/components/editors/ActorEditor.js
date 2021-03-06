import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import MovementTypeSelect from "../forms/MovementTypeSelect";
import SpriteSheetSelect from "../forms/SpriteSheetSelect";
import ScriptEditor from "../script/ScriptEditor";
import DirectionPicker from "../forms/DirectionPicker";
import { FormField, ToggleableFormField } from "../library/Forms";
import castEventValue from "../../lib/helpers/castEventValue";
import { DropdownButton } from "../library/Button";
import { MenuItem, MenuDivider } from "../library/Menu";
import l10n from "../../lib/helpers/l10n";
import MovementSpeedSelect from "../forms/MovementSpeedSelect";
import AnimationSpeedSelect from "../forms/AnimationSpeedSelect";
import Sidebar, { SidebarHeading, SidebarColumn } from "./Sidebar";
import { SceneIcon } from "../library/Icons";

class ActorEditor extends Component {
  onEdit = key => e => {
    this.props.editActor(this.props.sceneId, this.props.id, {
      [key]: castEventValue(e)
    });
  };

  onCopy = e => {
    this.props.copyActor(this.props.actor);
  };

  onPaste = e => {
    const { clipboardActor } = this.props;
    this.props.pasteActor(this.props.sceneId, clipboardActor);
  };

  onRemove = e => {
    this.props.removeActor(this.props.sceneId, this.props.id);
  };

  render() {
    const {
      index,
      actor,
      id,
      scene,
      spriteSheet,
      sceneImage,
      clipboardActor
    } = this.props;

    if (!actor) {
      return <div />;
    }

    return (
      <Sidebar>
        <SidebarColumn>
          <SidebarHeading
            title={l10n("ACTOR")}
            buttons={(
              <DropdownButton small transparent right>
                <MenuItem onClick={this.onCopy}>
                  {l10n("MENU_COPY_ACTOR")}
                </MenuItem>
                {clipboardActor && (
                <MenuItem onClick={this.onPaste}>
                  {l10n("MENU_PASTE_ACTOR")}
                </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={this.onRemove}>
                  {l10n("MENU_DELETE_ACTOR")}
                </MenuItem>
              </DropdownButton>
)}
          />

          <div>
            <FormField>
              <label htmlFor="actorName">{l10n("FIELD_NAME")}</label>
              <input
                id="actorName"
                placeholder={`Actor ${  index + 1}`}
                value={actor.name || ""}
                onChange={this.onEdit("name")}
              />
            </FormField>

            <FormField halfWidth>
              <label htmlFor="actorX">{l10n("FIELD_X")}</label>
              <input
                id="actorX"
                type="number"
                value={actor.x}
                placeholder={0}
                min={0}
                max={sceneImage.width - 2}
                onChange={this.onEdit("x")}
              />
            </FormField>

            <FormField halfWidth>
              <label htmlFor="actorY">{l10n("FIELD_Y")}</label>
              <input
                id="actorY"
                type="number"
                value={actor.y}
                placeholder={0}
                min={0}
                max={sceneImage.height - 1}
                onChange={this.onEdit("y")}
              />
            </FormField>

            <FormField>
              <label htmlFor="actorSprite">{l10n("FIELD_SPRITE_SHEET")}</label>
              <SpriteSheetSelect
                id="actorSprite"
                value={actor.spriteSheetId}
                direction={actor.direction}
                frame={
                  spriteSheet &&
                  spriteSheet.numFrames > 1 &&
                  actor.movementType === "static" &&
                  actor.frame
                }
                onChange={this.onEdit("spriteSheetId")}
              />
            </FormField>

            {spriteSheet &&
              spriteSheet.type !== "static" &&
              spriteSheet.type !== "animated" && (
                <FormField halfWidth>
                  <label htmlFor="actorMovement">
                    {l10n("FIELD_MOVEMENT_TYPE")}
                  </label>
                  <MovementTypeSelect
                    id="actorMovement"
                    value={actor.movementType}
                    onChange={this.onEdit("movementType")}
                  />
                </FormField>
              )}

            {spriteSheet &&
              spriteSheet.type !== "static" &&
              spriteSheet.type !== "animated" &&
              actor.movementType !== "static" && (
                <FormField halfWidth>
                  <label htmlFor="actorDirection">
                    {l10n("FIELD_DIRECTION")}
                  </label>
                  <DirectionPicker
                    id="actorDirection"
                    value={actor.direction}
                    onChange={this.onEdit("direction")}
                  />
                </FormField>
              )}

            {spriteSheet &&
              spriteSheet.numFrames > 1 &&
              actor.movementType === "static" && (
                <FormField halfWidth>
                  <label htmlFor="actorFrame">
                    {l10n("FIELD_INITIAL_FRAME")}
                  </label>
                  <input
                    id="actorFrame"
                    type="number"
                    min={0}
                    max={spriteSheet.numFrames - 1}
                    placeholder={0}
                    value={actor.frame}
                    onChange={this.onEdit("frame")}
                  />
                </FormField>
              )}

            {spriteSheet &&
              spriteSheet.numFrames > 1 &&
              (actor.movementType === "static" ||
                spriteSheet.type !== "actor") && (
                <FormField>
                  <label>
                    <input
                      type="checkbox"
                      className="Checkbox"
                      checked={actor.animate || false}
                      onChange={this.onEdit("animate")}
                    />
                    <div className="FormCheckbox" />
                    {actor.movementType !== "static" &&
                    spriteSheet.type === "actor_animated"
                      ? l10n("FIELD_ANIMATE_WHEN_STATIONARY")
                      : l10n("FIELD_ANIMATE_FRAMES")}
                  </label>
                </FormField>
              )}

            <FormField halfWidth>
              <label htmlFor="actorMoveSpeed">
                {l10n("FIELD_MOVEMENT_SPEED")}
              </label>
              <MovementSpeedSelect
                id="actorMoveSpeed"
                value={actor.moveSpeed}
                onChange={this.onEdit("moveSpeed")}
              />
            </FormField>

            {((spriteSheet &&
              spriteSheet.type === "actor_animated" &&
              actor.movementType !== "static") ||
              (actor.animate &&
                (actor.movementType === "static" ||
                  (spriteSheet && spriteSheet.type !== "actor")))) && (
                  <FormField halfWidth>
                    <label htmlFor="actorAnimSpeed">
                      {l10n("FIELD_ANIMATION_SPEED")}
                    </label>
                    <AnimationSpeedSelect
                      id="actorAnimSpeed"
                      value={actor.animSpeed}
                      onChange={this.onEdit("animSpeed")}
                    />
                  </FormField>
            )}

            <ToggleableFormField
              htmlFor="actorNotes"
              closedLabel={l10n("FIELD_ADD_NOTES")}
              label={l10n("FIELD_NOTES")}
              open={actor.notes}
            >
              <textarea
                id="actorNotes"
                value={actor.notes || ""}
                placeholder={l10n("FIELD_NOTES")}
                onChange={this.onEdit("notes")}
                rows={3}
              />
            </ToggleableFormField>
          </div>

          <SidebarHeading title={l10n("SIDEBAR_NAVIGATION")} />
          <ul>
            <li onClick={() => this.props.selectScene(scene.id)}>
              <div className="EditorSidebar__Icon">
                <SceneIcon />
              </div>
              {scene.name || `Scene ${  index + 1}`}
            </li>
          </ul>
        </SidebarColumn>

        <SidebarColumn>
          <ScriptEditor
            value={actor.script}
            type="actor"
            title={l10n("SIDEBAR_ACTOR_SCRIPT")}
            onChange={this.onEdit("script")}
          />
        </SidebarColumn>
      </Sidebar>
    );
  }
}

function mapStateToProps(state, props) {
  const { project } = state;
  const scene =
    project.present.scenes &&
    project.present.scenes.find(scene => scene.id === props.sceneId);
  const sceneImage =
    scene &&
    project.present.backgrounds.find(
      background => background.id === scene.backgroundId
    );
  const actor = scene && scene.actors.find(a => a.id === props.id);
  const index = scene && scene.actors.indexOf(actor);
  const spriteSheet =
    actor &&
    project.present.spriteSheets.find(
      spriteSheet => spriteSheet.id === actor.spriteSheetId
    );
  return {
    index,
    actor,
    scene,
    spriteSheet,
    sceneImage,
    clipboardActor: state.clipboard.actor
  };
}

const mapDispatchToProps = {
  editActor: actions.editActor,
  removeActor: actions.removeActor,
  copyActor: actions.copyActor,
  pasteActor: actions.pasteActor,
  selectScene: actions.selectScene
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActorEditor);
