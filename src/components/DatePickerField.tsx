import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  required?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  required = false,
  maximumDate,
  minimumDate,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Formatear fecha para mostrar (DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  // Convertir DD/MM/YYYY a YYYY-MM-DD
  const parseDateInput = (input: string): string => {
    // Si ya está en formato YYYY-MM-DD, retornarlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    // Si está en formato DD/MM/YYYY, convertirlo
    const parts = input.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return input;
  };

  const handleDateChange = (input: string) => {
    const formatted = parseDateInput(input);
    onChange(formatted);
  };

  // Para web, usar input type="date" nativo
  if (Platform.OS === 'web') {
    // @ts-ignore - Para web, podemos usar elementos HTML nativos
    const InputComponent = 'input' as any;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <InputComponent
          type="date"
          value={value || ''}
          onChange={(e: any) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            border: '1px solid #D4AF37',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#000000',
          }}
          max={maximumDate ? maximumDate.toISOString().split('T')[0] : undefined}
          min={minimumDate ? minimumDate.toISOString().split('T')[0] : undefined}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Para móvil, usar TextInput con formato
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => {
          // En móvil, abrir el date picker nativo
          // Por ahora, permitir edición manual
          setShowPicker(true);
        }}>
        <TextInput
          style={styles.textInput}
          value={formatDateForDisplay(value)}
          onChangeText={(text) => {
            // Permitir formato DD/MM/YYYY o YYYY-MM-DD
            handleDateChange(text);
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={10}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helperText}>
        Formato: DD/MM/YYYY o YYYY-MM-DD
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#FF6B60',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    minHeight: 50,
  },
  inputError: {
    borderColor: '#FF6B60',
  },
  textInput: {
    fontSize: 16,
    color: '#000000',
    padding: 0,
  },
  errorText: {
    color: '#FF6B60',
    fontSize: 12,
    marginTop: 5,
  },
  helperText: {
    fontSize: 12,
    color: '#D4AF37',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default DatePickerField;

