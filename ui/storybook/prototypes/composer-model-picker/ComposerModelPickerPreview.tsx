import { ComposerRunSettingsLiveStory, type LiveStoryProps } from "./ComposerRunSettingsLiveStory";

export type ComposerModelPickerPreviewProps = Omit<LiveStoryProps, "mobile">;

/** Keep the original story IDs while rendering the same picker used by the task composer. */
export function ComposerModelPickerPreview(props: ComposerModelPickerPreviewProps) {
  return <ComposerRunSettingsLiveStory {...props} mobile={props.compact} />;
}
