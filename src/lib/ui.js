import { ref } from 'vue'

// Whether the fixed site header is currently slid away; sticky bars below it
// (the menu toolbar) move up into its place.
export const headerHidden = ref(false)
