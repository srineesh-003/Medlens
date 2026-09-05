import React from 'react';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, HelpCircle } from 'lucide-react';

const statusConfig = {
  LOW: {
    label: 'LOW',
    className: 'status-low',
    icon: ArrowDownRight,
    title: 'Value is below reference range provided in source report',
  },
  NORMAL: {
    label: 'NORMAL',
    className: 'status-normal',
    icon: CheckCircle2,
    title: 'Value is within reference range provided in source report',
  },
  HIGH: {
    label: 'HIGH',
    className: 'status-high',
    icon: ArrowUpRight,
    title: 'Value is above reference range provided in source report',
  },
  UNKNOWN: {
    label: 'UNKNOWN',
    className: 'status-unknown',
    icon: HelpCircle,
    title: 'Source report did not provide enough information (reference range) for classification',
  },
};

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || 'UNKNOWN').toUpperCase();
  const config = statusConfig[normalizedStatus] || statusConfig.UNKNOWN;
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`} title={config.title}>
      <Icon size={13} className="status-icon" />
      <span className="status-text">{config.label}</span>
    </span>
  );
}

