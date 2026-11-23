import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  place: string;
};

export default function ItemCard({ title, place }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.place}>📍 {place}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  place: {
    marginTop: 6,
    color: '#4b5563',
  },
});
