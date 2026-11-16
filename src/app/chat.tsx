import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import { CloseIcon, SendIcon } from '../components/icons';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { COURIER_NAME } from '../data/courier';
import { formatTime } from '../utils/format';
import { colors, fonts } from '../theme';

type Message = {
    id: number;
    from: 'user' | 'courier';
    text: string;
    time: number;
};

const quickReplies = ['Где вы сейчас?', 'Оставьте у двери', 'Спасибо!'];
const genericReplies = ['Хорошо, понял!', 'Принято, скоро буду.', 'Уже в пути.'];

function createMessage(id: number, from: Message['from'], text: string): Message {
    return { id, from, text, time: Date.now() };
}

function getReply(text: string, index: number) {
    const value = text.toLowerCase();
    if (value.includes('где')) return 'Я в пути, буду у вас примерно через 10 минут.';
    if (value.includes('двер')) return 'Хорошо, оставлю заказ у двери.';
    if (value.includes('спасибо')) return 'Пожалуйста! Приятного аппетита!';
    return genericReplies[index % genericReplies.length];
}

function Bubble({ message, userName }: { message: Message; userName: string }) {
    const mine = message.from === 'user';

    return (
        <View style={[styles.messageRow, mine && styles.messageRowMine]}>
            {!mine ? <Avatar name={COURIER_NAME} size={30} tone="dark" /> : null}
            <View style={[styles.bubbleColumn, mine && styles.bubbleColumnMine]}>
                <Text style={styles.time}>{formatTime(message.time)}</Text>
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleCourier]}>
                    <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{message.text}</Text>
                </View>
            </View>
            {mine ? <Avatar name={userName} size={30} tone="soft" /> : null}
        </View>
    );
}

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useUser();
    const { lastOrder } = useCart();
    const [messages, setMessages] = useState<Message[]>(() => [
        createMessage(1, 'courier', 'Здравствуйте! Я забрал ваш заказ и уже еду к вам.'),
    ]);
    const [text, setText] = useState('');
    const nextId = useRef(2);
    const replyCount = useRef(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const listRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        const pending = timers.current;
        return () => {
            pending.forEach(clearTimeout);
        };
    }, []);

    const send = (value: string) => {
        const message = value.trim();
        if (!message) return;
        const mine = createMessage(nextId.current++, 'user', message);
        setMessages((current) => [...current, mine]);
        setText('');
        const index = replyCount.current++;
        const timer = setTimeout(() => {
            const reply = createMessage(nextId.current++, 'courier', getReply(message, index));
            setMessages((current) => [...current, reply]);
        }, 1400);
        timers.current.push(timer);
    };

    if (!lastOrder) {
        return (
            <View style={[styles.empty, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="dark" />
                <Text style={styles.emptyTitle}>Нет активного заказа</Text>
                <Text style={styles.emptyText}>Чат с курьером появится, когда вы оформите заказ.</Text>
                <Button title="Назад" onPress={() => router.back()} style={styles.emptyButton} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <CircleButton label="Закрыть чат" onPress={() => router.back()}>
                        <CloseIcon color={colors.title} size={16} />
                    </CircleButton>
                    <Avatar name={COURIER_NAME} size={44} tone="dark" />
                    <View>
                        <Text style={styles.name}>{COURIER_NAME}</Text>
                        <Text style={styles.role}>Ваш курьер</Text>
                    </View>
                </View>

                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <Bubble message={item} userName={user?.name ?? ''} />}
                    ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={styles.quickScroll} contentContainerStyle={styles.quickRow}>
                    {quickReplies.map((reply) => (
                        <Pressable key={reply} accessibilityRole="button" onPress={() => send(reply)} style={styles.quick}>
                            <Text style={styles.quickText}>{reply}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Напишите сообщение..."
                            placeholderTextColor={colors.gray}
                            selectionColor={colors.primary}
                            returnKeyType="send"
                            onSubmitEditing={() => send(text)}
                            style={styles.input}
                        />
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Отправить"
                            onPress={() => send(text)}
                            disabled={!text.trim()}
                            style={[styles.send, !text.trim() && styles.sendDisabled]}
                        >
                            <SendIcon />
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.white },
    container: { flex: 1, backgroundColor: colors.white },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
    name: { ...fonts.bold, fontSize: 17, color: colors.title },
    role: { ...fonts.regular, fontSize: 13, color: colors.gray, marginTop: 2 },
    list: { padding: 20, flexGrow: 1, justifyContent: 'flex-end' },
    messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    messageRowMine: { justifyContent: 'flex-end' },
    bubbleColumn: { maxWidth: '75%', alignItems: 'flex-start' },
    bubbleColumnMine: { alignItems: 'flex-end' },
    time: { ...fonts.regular, fontSize: 11, color: colors.gray, marginBottom: 4 },
    bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
    bubbleCourier: { backgroundColor: colors.input, borderBottomLeftRadius: 4 },
    bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
    bubbleText: { ...fonts.regular, fontSize: 14, lineHeight: 20, color: colors.title },
    bubbleTextMine: { color: colors.white },
    quickScroll: { flexGrow: 0 },
    quickRow: { gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
    quick: { paddingHorizontal: 14, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
    quickText: { ...fonts.medium, fontSize: 13, color: colors.primary },
    inputBar: { paddingHorizontal: 20, paddingTop: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, backgroundColor: colors.input, paddingLeft: 16, paddingRight: 10 },
    input: { flex: 1, height: 56, ...fonts.regular, fontSize: 15, color: colors.title, paddingVertical: 0, outlineStyle: 'none' } as never,
    send: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    sendDisabled: { opacity: 0.4 },
    empty: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { ...fonts.bold, fontSize: 22, color: colors.title },
    emptyText: { ...fonts.regular, fontSize: 15, color: colors.grayText, textAlign: 'center', marginTop: 8 },
    emptyButton: { alignSelf: 'stretch', marginTop: 28 },
});