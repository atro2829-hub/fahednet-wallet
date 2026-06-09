# Task 53 - Enhanced Support Screen with Live Chat

## Summary
Enhanced the support screen at `/home/z/my-project/src/components/fahed/support-screen.tsx` with a real-time live chat interface.

## Changes Made
1. **Added "محادثة مباشرة" (Live Chat) tab** alongside existing FAQ and Tickets tabs
2. **Chat interface with bubble UI**: User messages on left (RTL), support on right
3. **Firebase persistence**: Chat messages stored at `supportChats/{userId}/messages/`
4. **Simulated support auto-replies**: Random Arabic support responses after 3 seconds
5. **Typing indicator**: Animated 3-dot indicator when "agent" is composing
6. **Support agent avatar and name**: "فريق الدعم - محفظة الجنوب" with Headphones icon
7. **Online/offline status indicator**: Green dot for online, grey for offline (85% online simulation)
8. **Message timestamps**: Arabic time format display
9. **Message input with send button**: Enter key support, disabled state when empty
10. **Kept existing FAQ section** and ticket system intact
11. **Kept ticket creation form** unchanged

## Technical Details
- Chat messages use `ChatMessage` interface with id, sender, text, timestamp
- Firebase `onValue` listener for real-time chat updates
- Auto-reply with random delay (1s typing indicator + 3s response)
- `useCallback` for `handleSendChatMessage` to prevent unnecessary re-renders
- Chat loading state with spinner
- Empty state with instructions when no messages
