import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { ClayInput } from '@/components/ui/ClayInput';
import { ClayButton } from '@/components/ui/ClayButton';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { mockChatMessages } from '@/services/mockData';

interface MessageThread {
  id: string;
  parentName: string;
  studentName: string;
  grade: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const INITIAL_THREADS: MessageThread[] = [
  {
    id: 'tch_01',
    parentName: 'Kishore Mohan',
    studentName: 'Leo Martin',
    grade: 'Grade 4-B',
    lastMessage: 'Thank you Ms. Sarah! Will check his homework tonight.',
    time: '10:35 AM',
    unread: false,
  },
  {
    id: 'tch_02',
    parentName: 'Anita Sharma',
    studentName: 'Aarav Sharma',
    grade: 'Grade 4-B',
    lastMessage: 'Good morning, will Aarav have sports practice today?',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 'tch_03',
    parentName: 'David Miller',
    studentName: 'Sophia Miller',
    grade: 'Grade 4-B',
    lastMessage: 'We received the midterm syllabus. Thanks!',
    time: '2 days ago',
    unread: false,
  },
];

export default function TeacherMessagesScreen() {
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [chatMessages, setChatMessages] = useState(mockChatMessages['tch_01'] || []);
  const [replyText, setReplyText] = useState('');

  const handleSend = () => {
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'tch_01',
      senderName: 'Ms. Sarah',
      recipientId: selectedThread?.id || 'par_01',
      message: replyText.trim(),
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setReplyText('');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          {selectedThread ? (
            <View style={styles.chatHeaderRow}>
              <TouchableOpacity
                onPress={() => setSelectedThread(null)}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={20} color="#1E293B" />
              </TouchableOpacity>
              <View style={styles.headerTextGroup}>
                <Text style={styles.headerTitle}>{selectedThread.parentName}</Text>
                <Text style={styles.headerSubtitle}>
                  Parent of {selectedThread.studentName} ({selectedThread.grade})
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.headerTitle}>Parent Communications</Text>
              <Text style={styles.headerSubtitle}>Messages & queries from parents</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {selectedThread ? (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
            >
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.isMe ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.isMe ? styles.myMessageText : styles.otherMessageText,
                    ]}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      msg.isMe ? styles.myMessageTime : styles.otherMessageTime,
                    ]}
                  >
                    {msg.timeLabel}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#94A3B8"
                value={replyText}
                onChangeText={setReplyText}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
                disabled={!replyText.trim()}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView
            style={styles.threadList}
            contentContainerStyle={styles.threadListContent}
          >
            {threads.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedThread(item)}
                activeOpacity={0.7}
                style={[styles.threadCard, Shadows.soft]}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{item.parentName.charAt(0)}</Text>
                </View>
                <View style={styles.threadInfo}>
                  <View style={styles.threadTopRow}>
                    <Text style={styles.parentNameText}>{item.parentName}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.studentLabel}>
                    Parent of {item.studentName} • {item.grade}
                  </Text>
                  <Text style={styles.lastMsgText} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>
                {item.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>

      <BottomLandscape />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ECE5D8',
    backgroundColor: '#FAF7F2',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  threadList: {
    flex: 1,
  },
  threadListContent: {
    padding: 16,
    paddingBottom: 90,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
  },
  threadInfo: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parentNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  studentLabel: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 1,
  },
  lastMsgText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  otherMessageText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#94A3B8',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#ECE5D8',
    alignItems: 'center',
    marginBottom: 75,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: '#1E293B',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
});
